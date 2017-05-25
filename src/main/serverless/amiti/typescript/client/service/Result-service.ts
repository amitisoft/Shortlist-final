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
const format = require('string-template');
const _ = require('lodash');


const AWS = require('aws-sdk');

import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: 'us-east-1'
});

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
    
    update(dataa: any): Observable<Result> {
    //     let dataConversion: any;
    //     console.log('data before type of----', typeof dataa);
    //    if (typeof dataa == 'string'){
    //     dataConversion = JSON.parse(dataa);
    //   }
    //   else{
    //     dataConversion = dataa;
    //   }
        console.log('data After type of----', typeof dataa);
        console.log('in ResultServiceImpl get()');
        const documentClient = new DocumentClient();
        let data = dataa;
        console.log('dataconversion = ', data);
        let score;
        if (data.curct_ans === data.cand_ans)
            score = 1;
        else
            score = 0;
        const params = {
            TableName: 'result',
            Key: {
                CandidateId: data.CandidateId,
                QsnId: data.QsnId
            },
            ExpressionAttributeNames: {
                '#bi': 'BookingId',
                '#a' : 'curct_ans',
                '#ca': 'cand_ans',
                '#s' : 'score'
            },
            ExpressionAttributeValues: {
                ':bi': data.BookingId,
                ':a' : data.curct_ans,
                ':ca': data.cand_ans,
                ':s' : score
            },
            UpdateExpression: 'SET #bi = :bi,  #a=:a , #ca = :ca , #s =:s',
            ReturnValues: 'ALL_NEW',
        };

        return Observable.create((observer: Observer<Result>) => {
            documentClient.update(params, (err, result: any) => {
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
                    return that.questionServiceImpl.getQsn(questionId, category);
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
                                        'type': 'long'
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
                                        'type': 'long'
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
                                        'type': 'long',
                                        'index': 'true'
                                    },
                                    'question': {
                                        'type': 'text',
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

}
