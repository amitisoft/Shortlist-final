import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Result } from '../domain/Result';
import { DynamoDB } from 'aws-sdk';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { UtilHelper } from '../../api/util/util-helper';
import { CandidateServiceImpl } from './candidate-service';
import { Client } from 'elasticsearch';
import { Candidate } from '../domain/candidate';

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

  constructor(private elasticSearchEndPoint: string, private region: string, private documentClient: DynamoDB.DocumentClient, private candidateServiceImpl: CandidateServiceImpl) {
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

    // constructor() {
    //     console.log('in ResultServiceImpl constructor()');
    // }

    update(dataa: any): Observable<Result> {
        let dataConversion: any;
        console.log('data before type of----', typeof dataa);
    //   if (typeof dataa == 'string'){
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
        return Observable.create((observer: Observer<boolean>) => {
            let resultIndexMappingFlow = UtilHelper.waterfall([
                function () {
                    let candidateId = record.getValueByKey('candidateId');
                    console.log(`candidateId ${candidateId}`);
                    return that.candidateServiceImpl.findById(candidateId);
                    // let bookingId = record.getValueByKey('bookingId');
                    // console.log(`bookingId ${bookingId}`);
                    // return that.candidateServiceImpl.findById(bookingId);
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
                          //  that.upsertBookingIndex(record, observer);
                            break;
                        case 'UPDATE':
                         //   that.upsertBookingIndex(record, observer);
                            break;
                        case 'DELETE':
                          //  that.deleteBookingDocument(record, observer);
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
                                    'bookingId': {
                                        'type': 'long'
                                    },
                                    'candidateId': {
                                        'type': 'long'
                                    },
                                    'category': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'dateOfExam': {
                                        'type': 'date',
                                        'format': 'DD/MM/YYYY'
                                    },
                                    'email': {
                                        'type': 'keyword',
                                        'index': 'true'
                                    },
                                    'fullName': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'paperType': {
                                        'type': 'keyword',
                                        'index': 'true'
                                    },
                                    'testStatus': {
                                        'type': 'keyword',
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
     private checkIfResultIndexExists(): Observable<boolean> {
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
}
