import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Result } from '../domain/Result';
import { DynamoDB } from 'aws-sdk';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { UtilHelper } from '../../api/util/util-helper';
import { CandidateServiceImpl } from './candidate-service';
import { Client } from 'elasticsearch';
import { Candidate } from '../domain/candidate';
import { Booking } from '../domain/booking';
import { BookingServiceImpl } from '../service/booking-service';
import { Question } from '../domain/question';
import { QuestionServiceImpl } from '../service/Question-service';
import { ResultSearch } from '../domain/resultSearch';
import moment = require('moment');
const format = require('string-template');
const _ = require('lodash');
const AWS = require('aws-sdk');

import DocumentClient = DynamoDB.DocumentClient;

export interface ResultSearchParams {
    fullName?: string;
    email?: string;
    phoneNumber?: number;
    jobPosition?: string;
    dateOfExamRange?: string;
    score?: string;
    from: number;
    size: number;
}

AWS.config.update({
    region: 'us-east-1'
});

export interface updateResultsParams {
    candidateId: string;
    bookingId:string;
    questionId:string;
    candidateAns:string[];
    correctAns:string[];
    score:string;
}

@Injectable()
export class ResultServiceImpl {

    elasticSearchClient: Client;
    RESULT_INDEX = 'result_index';
    RESULT_MAPPING = 'result';

  constructor(private elasticSearchEndPoint: string, private region: string,
   private documentClient: DynamoDB.DocumentClient, private candidateServiceImpl: CandidateServiceImpl,
   private bookingServiceImpl: BookingServiceImpl, private questionServiceImpl: QuestionServiceImpl) {
        console.log(`calling booking constructor with search end point ${elasticSearchEndPoint}`);
        console.log(`calling booking constructor with region ${region}`);
        this.elasticSearchClient = new Client({
            hosts: [elasticSearchEndPoint],
            log: 'trace'
        });

        AWS.config.update({
            region: region
        });

    }

    update(dataa: updateResultsParams): Observable<Result> {
        console.log('in ResultServiceImpl get()',dataa);
        let data = JSON.parse(JSON.stringify(dataa));
        let that=this;

          let decodedData = new Buffer(data.correctAns, 'base64').toString('ascii');
           let crctAns = JSON.parse(decodedData);
           console.log("corrected Ans",JSON.parse(decodedData));
           console.log("candidate Ans",data.candidateAns);
           let score;
           
           let multiAnswer = 0;

     crctAns.forEach((item) =>
     {
         let array= data.candidateAns.filter((id) =>
         {
             if(id === item)
            multiAnswer++;
         })
     })
            if(crctAns.length === multiAnswer )
                      score =1;
                      else
                     score =0;
   
    
           const params = {
            TableName: 'result',
            Key: {
               candidateId: data.candidateId,
                questionId: data.questionId
                //questionId: JSON.stringify(data.questionId)
            },
            ExpressionAttributeNames: {
                '#bi': 'bookingId',
                '#a' : 'correctAns',
                '#ca': 'candidateAns',
                '#s' : 'score'
            },
            ExpressionAttributeValues: {
                ':bi': data.bookingId,
                ':a' : data.correctAns,
                ':ca': data.candidateAns,
                ':s' : score
            },
            UpdateExpression: 'SET #bi = :bi,  #a=:a , #ca = :ca , #s =:s',
            ReturnValues: 'ALL_NEW',
        };
        console.log("params==========",params);
        return Observable.create((observer: Observer<Result>) => {
            that.documentClient.update(params, (err, result: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                }
                console.log(`result ${JSON.stringify(data)}`);
                observer.next(result.Attributes);
                observer.complete();
            });
        });

    }


       updateResultToElasticSearch(record: DBStreamRecord): Observable<boolean> {
           console.log('sevice');
        let that = this;
        let category: string ;
        return Observable.create((observer: Observer<boolean>) => {
            let resultIndexMappingFlow = UtilHelper.waterfall([
                function () {
                    let candidateId = record.getValueByKey('candidateId');
                    console.log(`candidateId ${candidateId}`);
                    return that.candidateServiceImpl.findById(candidateId);
                },
                function (candidate: Candidate) {
                    record.addToNewImageAttributes('fullName', {
                        'S': `${candidate.firstName} ${candidate.lastName}`
                    });

                    record.addToNewImageAttributes('email', {
                        'S': `${candidate.email}`
                    });

                     record.addToNewImageAttributes('phoneNumber', {
                        'N': `${candidate.phoneNumber}`
                    });

                    return candidate != null ? Observable.from([true]) :
                        Observable.throw(new Error('Candidate does not exist.'));
                },
                function () {
                    let bookingId = record.getValueByKey('bookingId');
                    console.log(`bookingId ${bookingId}`);
                    return that.bookingServiceImpl.getByBookingId(bookingId);
                },
                function (booking: Booking) {
                    category = booking[0].category;
                    console.log(' BOOKING INFO-----------------', booking);
                    record.addToNewImageAttributes('category', {
                        'S': `${booking[0].category}`
                    });

                    record.addToNewImageAttributes('jobPosition', {
                        'S': `${booking[0].jobPosition}`
                    });

                     record.addToNewImageAttributes('dateOfExam', {
                        'S': `${booking[0].dateOfExam}`
                    });

                    return booking != null ? Observable.from([true]) :
                        Observable.throw(new Error('Booking does not exist.'));
                },
                function () {
                    let questionId = record.getValueByKey('questionId');
                    console.log(`bookingId ${questionId}`);

                    return that.questionServiceImpl.getQuestion(questionId, category);
                },
                function (question: Question) {
                    console.log(' Question INFO-----------------', question);
                    record.addToNewImageAttributes('question', {
                        'S': `${question[0].question}`
                    });
                    return question != null ? Observable.from([true]) :
                        Observable.throw(new Error('Question does not exist.'));
                },
                function (dependecySatisfied) {
                    return that.checkIfResultIndexExists();
                },
                function (isResultExists) {
                    return isResultExists ? Observable.from([true]) :
                     that.createResultMapping(isResultExists);
                }
            ]);
            resultIndexMappingFlow.subscribe(
                function (x) {
                    console.log('booking index and mapping successfully created');
                    switch (record.getEventName()) {
                        case 'INSERT':
                            that.upsertResultIndex(record, observer);
                            break;
                        case 'UPDATE':
                            that.upsertResultIndex(record, observer);
                            break;
                        case 'DELETE':
                            that.deleteResultDocument(record, observer);
                            break;
                        case 'MODIFY':
                            that.upsertResultIndex(record, observer);
                            break;
                        case 'REMOVE':
                            that.deleteResultDocument(record, observer);
                            break;
                        default:
                            break;
                    }
                },
                function (err) {
                    console.log(`booking index and mapping failed created ${err.stack}`);
                    observer.error(`booking index and mapping failed created ${err.stack}`);
                }
            );
        });
    }

 createResultMapping(resultExists: boolean): Observable<boolean> {
        console.log('in createBookingMapping');
        return Observable.create((observer: Observer<boolean>) => {
            if (!resultExists) {
                this.elasticSearchClient.indices.create({
                    index: this.RESULT_INDEX,
                    body: {
                        'mappings': {
                            'result': {
                                'properties': {
                                    'candidateId': {
                                        'type': 'keyword'
                                    },
                                    'email': {
                                        'type': 'keyword',
                                        'index': 'true'
                                    },
                                    'fullName': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'phoneNumber': {
                                        'type': 'long',
                                        'index': 'true'
                                    },
                                    'bookingId': {
                                        'type': 'keyword'
                                    },
                                    'category': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'jobPosition': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'dateOfExam': {
                                        'type': 'date',
                                        'format': 'DD/MM/YYYY'
                                    },
                                    'questionId': {
                                        'type': 'keyword',
                                        'index': 'true'
                                    },
                                    'question': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'actualAns': {
                                       'type': 'text',
                                       'index': 'true'
                                    },
                                    'candidateAns': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'score': {
                                        'type': 'long',
                                        'index': 'true'
                                    }
                                }
                            }
                        }
                    }
                }, (error: any, response: any, status: any) => {
                    if (error) {
                        observer.error(false);
                        return;
                    }
                    console.log(`createBookingMapping response ${JSON.stringify(response)}`);
                    console.log(`createBookingMapping status ${JSON.stringify(status)}`);
                    observer.next(true);
                    observer.complete();
                });
            } else {
                observer.next(true);
                observer.complete();
            }


        });
    }

    checkIfResultIndexExists(): Observable<boolean> {
        let that = this;
        return Observable.create((observer: Observer<boolean>) => {
            this.elasticSearchClient.indices.exists({
                index: this.RESULT_INDEX
            }, (error: any, response: any, status: any) => {
                if (error) {
                    console.log('Result INDEX DOESNT EXISTS');
                    observer.error({});
                    return;
                }
                if (!response) {
                    observer.next(false);
                    observer.complete();
                }

                observer.next(true);
                observer.complete();

            });
        });
    }
     upsertResultIndex(record: DBStreamRecord, observer: Observer<boolean>): void {
        let updateParams = this.constructResultESUpdates(record);

        this.elasticSearchClient.update(updateParams, (err: any, resp: any) => {
            if (err) {
                console.error('failed to add/update booking', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`added document to Result index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });

    }

    deleteResultDocument(record: DBStreamRecord, observer: Observer<boolean>) {
        this.elasticSearchClient.delete({
            index: this.RESULT_INDEX,
            type: this.RESULT_MAPPING,
            id: record.getKeys()[0].value,
        }, (err: any, resp: any) => {
            if (err) {
                console.error('failed to delete Result', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`removed document to Result index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });
    }

 constructInsertOnlyParams(record: DBStreamRecord): any {
        let uniqueObject = record.getAllUniqueProperties();
        uniqueObject['dateOfExam'] = record.convertToDate(uniqueObject['dateOfExam']);
        console.log(`uniques ${JSON.stringify(uniqueObject)}`);
        return uniqueObject;
    }

    constructUpdateOnlyParams(record: DBStreamRecord): any {

        let updateInputs = _.filter(record.getNewImage(), function (o) {
            return o.key !== record.getKeys()[0].key;
        });


        console.log(`record new ${JSON.stringify(updateInputs)}`);
        let queries = _.reduce(_.map(updateInputs, 'key'), (inlineQueries, value) => {
            return inlineQueries = inlineQueries + format('ctx._source.{0} = params.{1};', value, value);
        }, '');

        let params = {};
        updateInputs.forEach((obj) => {
            if (obj['key'] === 'dateOfExam') {
                obj['value'] = record.convertToDate(obj['value']);
            }
            params[obj['key']] = obj['value'];
        });

        let updateOnly = {
            inline: queries,
            params: params
        };

        console.log(`updateOnly ${JSON.stringify(updateOnly)}`);
        return updateOnly;
    }
        constructResultESUpdates(record: DBStreamRecord): any {
        return {
            index: this.RESULT_INDEX,
            type: this.RESULT_MAPPING,
            id: record.getKeys()[0].value,
            body: {
                script: this.constructUpdateOnlyParams(record),
                upsert: this.constructInsertOnlyParams(record)
            }
        };
    }

        findESResultSearch(params: ResultSearchParams): Observable<ResultSearch[]> {
        let email = format('{0}', params.email);
        let emailCondition: any = params.email ? {
            'term': {
                email
            }
        } : undefined;


        let score = format('{0}', params.score);
        let scoreCondition: any = params.score ? {
            'term': {
                score
            }
        } : undefined;

        let phoneNumber = format('{0}', params.phoneNumber);
        let phoneNumberCondition: any = params.phoneNumber ? {
            'term': {
                phoneNumber
            }
        } : undefined;

        let fullName = format('{0}', params.fullName);
        let fullNameCondition: any = params.fullName ? {
            'match': {
                fullName
            }
        } : undefined;

        let jobPosition = format('{0}', params.jobPosition);
        let jobPositionCondition: any = params.jobPosition ? {
            'match': {
                jobPosition
            }
        } : undefined;

        let dateOfExamCondition: any;
        if (params.dateOfExamRange) {
            let dateRange = params.dateOfExamRange.split('-');
            let fromDate = format('{0}', dateRange[0]);
            let toDate = format('{0}', dateRange[1]);

            dateOfExamCondition = params.dateOfExamRange ?
                {
                    'range': {
                        'dateOfExam': {
                            'lte': toDate,
                            'gte': fromDate
                        }
                    }
                } : '';
        } else {
            let toDefaultDate = format('{0}', moment().format('DD/MM/YYYY'));
            let fromDefaultDate = format('{0}', moment().subtract(30, 'days').format('DD/MM/YYYY'));

            dateOfExamCondition = {
                'range': {
                    'dateOfExam': {
                        'lte': toDefaultDate
                    }
                }
            };
        }

        let mustConditions = [
            emailCondition,
            scoreCondition,
            phoneNumberCondition,
            fullNameCondition,
            jobPositionCondition
        ];


        const filteredMustConditions = _.without(mustConditions, undefined);

        return Observable.create((observer: any) => {
            this.elasticSearchClient.search({
                from: params.from,
                size: params.size,
                index: this.RESULT_INDEX,
                type: this.RESULT_MAPPING,
                body: {
                    query: {
                        'bool': {
                            'must': filteredMustConditions,
                            'filter': dateOfExamCondition
                        }
                    }
                }
            }, (err: any, resp: any) => {
                if (err) {
                    console.error(`Failed to read result information ${err}`);
                    observer.error(err);
                    return;
                }
                console.log(`search finished for result ${resp}`);
                const resultOfSearch = resp.hits.hits.map(hit => {

                    const resultInfo = hit._source;
                    const result: any = {
                        candidateId: resultInfo.candidateId,
                        bookingId: resultInfo.bookingId,
                        phoneNumber: resultInfo.phoneNumber,
                        score: resultInfo.score,
                        category: resultInfo.category,
                        jobPosition: resultInfo.jobPosition,
                        dateOfExam: resultInfo.dateOfExam,
                        fullName: resultInfo.fullName,
                        email: resultInfo.email
                    };
                    return result;
                });
                observer.next(resultOfSearch);
                observer.complete();
            });

        });
    }

}
