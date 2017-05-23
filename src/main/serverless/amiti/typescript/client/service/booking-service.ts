import { Observable, Observer } from'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Booking } from '../domain/booking';
import { Client } from 'elasticsearch';
import { Candidate } from '../domain/candidate';
import { DynamoDB } from 'aws-sdk';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { UtilHelper } from '../../api/util/util-helper';

const AWS = require('aws-sdk');
const format = require('string-template');
const _ = require('lodash');


@Injectable()
export class BookingServiceImpl {

    private elasticSearchClient: Client;
    private BOOKING_INDEX = 'booking_index';
    private BOOKING_MAPPING = 'booking';


    constructor(private elasticSearchEndPoint: string, private region: string, private documentClient: DynamoDB.DocumentClient) {
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

    /**
     * isLinkActive()
     * Candidate click on TestLink Before test
     * @param pathParameter
     */
    // isLinkActive(pathParameter: any): Observable<boolean> {
    //     let decodedData = JSON.parse(new Buffer(pathParameter.testLinkinfo, 'base64').toString('ascii'));
    //     console.log('in is active method', decodedData.bookingId);
    //     const queryParams: DynamoDB.Types.QueryInput = {
    //         TableName: 'booking',
    //         KeyConditionExpression: '#bookingId = :bookingIdData',
    //         ExpressionAttributeNames: {
    //             '#bookingId': 'bookingId',
    //         },
    //         ExpressionAttributeValues: {
    //             ':bookingIdData': decodedData.bookingId,
    //         },
    //         ProjectionExpression: 'candidateId,bookingId,testStatus',
    //         ScanIndexForward: false
    //     };
    //     const documentClient = new DocumentClient();
    //     return Observable.create((observer: Observer<boolean>) => {
    //         documentClient.query(queryParams, (err, data: any) => {
    //             if (err) {
    //                 observer.error(err);
    //                 throw err;
    //             }
    //             // check testStatus
    //             console.log('testStatus', data);
    //             if (data.Items[0].testStatus === 'NotTaken') {
    //                 observer.next(false);
    //                 observer.complete();
    //                 return;
    //             }
    //         });
    //     });
    // }


    /**
     * updateBookingAfterStartTest
     * Hr click on starttest button
     * @param data
     */
    updateBookingAfterStartTest(data: any): Observable<Booking> {
        console.log('in CandidateServiceImpl update()');
        console.log(`data received ${ data.category }`);
        console.log(`data received ${ data.jobPostion }`);
        console.log(`data received ${ data.DOE }`);
        console.log(`data received ${ data.paperType }`);

        const params = {
            TableName: 'booking',
            Key: {
                bookingId: data.bookingId,
            },
            ExpressionAttributeNames: {
                '#ca': 'category',
                '#jp': 'jobPostion',
                '#DOE': 'DOE',
                '#ts': 'testStatus',
                '#pt': 'paperType',
                '#cid': 'candidateId'
            },
            ExpressionAttributeValues: {
                ':ca': data.category,
                ':jp': data.jobPosition,
                ':DOE': new Date().getTime(),
                ':ts': 'progress',
                ':pt': data.paperType,
                ':cid': data.candidateId
            },
            UpdateExpression: 'SET #ca = :ca,#jp=:jp, #DOE = :DOE, #ts= :ts, #pt =:pt, #cid=:cid',
            ReturnValues: 'ALL_NEW',
        };

        return Observable.create((observer: Observer<Booking>) => {

            this.documentClient.update(params, (err, result: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                }
                console.log(`result ${ JSON.stringify(data) }`);
                observer.next(result.Attributes);
                observer.complete();
            });
        });
    }

    /**
     * get the data who are not taken the test.......
     * data whichcontains last data of previous query
     */
    getWhoNotTakenTest(lastEvaluatedKey: any): Observable<Booking[]> {

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            IndexName: 'testStatusGSI',
            KeyConditionExpression: '#testStatus = :v_test',
            ExpressionAttributeNames: {
                '#testStatus': 'testStatus'
            },
            ExpressionAttributeValues: {
                ':v_test': 'NotTaken'
            },
            Limit: 5,
            ProjectionExpression: 'candidateId, category,testStatus,bookingId,jobPosition',
            ScanIndexForward: true
        };
        lastEvaluatedKey = null;
        if (lastEvaluatedKey != null) {
            console.log('-----------------------------with data-----------------------');
            console.log(' data-------------', lastEvaluatedKey.candidateId);
            queryParams.ExclusiveStartKey = {
                bookingId: lastEvaluatedKey.bookingId,
                testStatus: decodeURIComponent(lastEvaluatedKey.testStatus),
                candidateId: lastEvaluatedKey.candidateId
            };
        } else {
            console.log('----------------------------without data----------------------');
        }

        return Observable.create((observer: Observer<Booking>) => {
            this.documentClient.query(queryParams, (err, data: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${ data.Items.length }`);
                if (data.Items.length === 0) {
                    observer.complete();
                    return;
                }
                console.log('LastEvaluatedKey=', data.LastEvaluatedKey);
                observer.next((data.Items));
                observer.complete();
            });
        });
    }

    getTestInProgressBooking(): Observable<Booking[]> {

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            IndexName: 'testStatusGSI',
            KeyConditionExpression: '#testStatus = :v_test',
            ExpressionAttributeNames: {
                '#testStatus': 'testStatus'
            },
            ExpressionAttributeValues: {
                ':v_test': 'progress'
            },
            ProjectionExpression: 'candidateId, category,testStatus,bookingId,jobPosition',
            ScanIndexForward: false
        };
        return Observable.create((observer: Observer<Booking>) => {
            this.documentClient.query(queryParams, (err, data: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${ data.Items.length }`);
                if (data.Items.length === 0) {
                    observer.complete();
                    return;
                }
                observer.next((data.Items));
                observer.complete();
            });
        });
    }

    /**
     * get candidate information
     *
     */

    getAllCandidateInfoWhoNotTakenTest(data: any): Observable<Booking[]> {
        let candidateKey = [];
        data.forEach((item) => {
            console.log('in side for each');
            let myObj = {'candidateId': ''};
            myObj.candidateId = item.candidateId;
            let checkUniq = candidateKey.find((obj) => {
                return obj.candidateId === myObj.candidateId;
            });
            if (!checkUniq) {
                candidateKey.push(myObj);
            }
        });
        console.log('candidate Id list = ', candidateKey);

        let params = {
            RequestItems: {
                'candidate': {
                    Keys: candidateKey,
                    ProjectionExpression: 'email,firstName,lastName,candidateId'
                }
            }
        };
        return Observable.create((observer: Observer<Booking>) => {
            this.documentClient.batchGet(params, function (err, data1) {
                if (err) {
                    observer.error(err);
                    throw err;
                } else {
                    let resultArray: any = [];
                    // console.log('booking data = ',data);
                    let res = (JSON.parse(JSON.stringify(data1.Responses))).candidate;
                    //  console.log('res = ',res);
                    data.forEach((item) => {
                        let newArray = res.filter((id) => {
                            return (id.candidateId === item.candidateId);
                        });
                        //  console.log('new array', newArray[0]);
                        //  console.log('item = ',item.candidateId);
                        // if (newArray != undefined){
                        let bookinginfo = new Booking();
                        bookinginfo.candidateId = item.candidateId;
                        bookinginfo.candidateId = item.candidateId;
                        bookinginfo.testStatus = item.testStatus;
                        bookinginfo.bookingId = item.bookingId;
                        bookinginfo.category = item.category;
                        bookinginfo.fullName = `${ newArray[0].firstName } ${ newArray[0].lastName }`;
                        bookinginfo.email = newArray[0].email;
                        bookinginfo.jobPosition = item.jobPosition;
                        resultArray.push(bookinginfo);
                        //  console.log(' result', bookinginfo);
                        //      }

                    });
                    observer.next(resultArray);
                    observer.complete();
                }
            });
        });
    }


    /**
     * get data from uri, decode and send candidate information about test
     *
     * test not taken ---- able to take test
     * progress -----After clicking on start test
     * test taken ---- after test completed
     */

    getCandidateHomePageInfo(data: any): any {
        let decodedData = JSON.parse(new Buffer(data.candidateinfo, 'base64').toString('ascii'));

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            KeyConditionExpression: '#bookingId = :bookingId',
            ExpressionAttributeNames: {
                '#bookingId': 'bookingId'
            },
            ExpressionAttributeValues: {
                ':bookingId': decodedData.bookingId
            },
            ProjectionExpression: 'candidateId, category,paperType,bookingId,testStatus',
            ScanIndexForward: false
        };

        return Observable.create((observer: Observer<Booking>) => {
            this.documentClient.query(queryParams, (err, result: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                if (result.Items.length === 0) {
                    observer.complete();
                    return;
                }
                // check testStatus
                console.log(result);
                console.log('test status', result.Items[0].testStatus);
                if (result.Items[0].testStatus === 'progress') {
                    observer.next((result.Items[0]));
                    observer.complete();
                    return;
                }
                observer.error('contact our HR');
                return;
            });
        });
    }

    /**
     *  checking candidate Token
     */
    candidateTokenChecking(data, pathParameter): any {
        let decodedData = JSON.parse(new Buffer(pathParameter.candidateinfo, 'base64').toString('ascii'));
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            KeyConditionExpression: '#candidateId = :candidateId',
            ExpressionAttributeNames: {
                '#candidateId': 'candidateId'
            },
            ExpressionAttributeValues: {
                ':candidateId': data.candidateId
            },
            ProjectionExpression: 'candidateId, token',
            ScanIndexForward: false
        };

        return Observable.create((observer: Observer<Booking>) => {
            this.documentClient.query(queryParams, (err, data1: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                // check token
                console.log('token data', data1.Items);
                if (data1.Items[0].token === decodedData.token) {
                    observer.next((data));
                    observer.complete();
                    return;
                }
                observer.error('Candidate token miss matched');
                return 'Candidate token miss matched';
            });
        });
    }

    getCandidatesListFile(data: any): Observable<Candidate[]> {
        console.log('inside of get candidatelist file service layer');

        return Observable.create((observer: Observer<Candidate>) => {
            console.log(data);
            let candidate = new Candidate();
            candidate.candidateId = '1';
            candidate.email = 'email';
            candidate.firstName = 'first';
            candidate.lastName = 'last';
            candidate.phoneNumber = 12222;
            observer.next(candidate);
            observer.complete();
        });

    }

    updateBookingToElasticSearch(record: DBStreamRecord): Observable<boolean> {
        let that = this;
        return Observable.create((observer: Observer<boolean>) => {
            let bookingIndexMappingFlow = UtilHelper.waterfall([
                function () {
                    return that.checkIfBookingIndexExists();
                },
                function (isBookingExists) {
                    return isBookingExists ? Observable.from([true]) :
                        that.createBookingMapping(isBookingExists);
                }
            ]);
            bookingIndexMappingFlow.subscribe(
                function (x) {
                    console.log('booking index and mapping successfully created');
                    switch (record.getEventName()) {
                        case 'INSERT':
                            that.upsertBookingIndex(record, observer);
                            break;
                        case 'UPDATE':
                            that.upsertBookingIndex(record, observer);
                            break;
                        case 'DELETE':
                            that.deleteBookingDocument(record, observer);
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

    private createBookingMapping(bookingExists: boolean): Observable<boolean> {
        console.log('in createBookingMapping');
        return Observable.create((observer: Observer<boolean>) => {
            if (!bookingExists) {
                this.elasticSearchClient.indices.create({
                    index: this.BOOKING_INDEX,
                    body: {
                        'mappings': {
                            'booking': {
                                'properties': {
                                    'bookingId': {
                                        'type': 'long'
                                    },
                                    'candidateId': {
                                        'type': 'long'
                                    },
                                    'category': {
                                        'type': 'text'
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

    private checkIfBookingIndexExists(): Observable<boolean> {
        let that = this;
        return Observable.create((observer: Observer<boolean>) => {
            this.elasticSearchClient.indices.exists({
                index: this.BOOKING_INDEX
            }, (error: any, response: any, status: any) => {
                if (error) {
                    console.log('BOOKING INDEX DOESNT EXISTS');
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

    private upsertBookingIndex(record: DBStreamRecord, observer: Observer<boolean>): void {
        let updateParams = this.constructBookingESUpdates(record);

        this.elasticSearchClient.update(updateParams, (err: any, resp: any) => {
            if (err) {
                console.error('failed to add/update booking', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`added document to book index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });

    }

    private deleteBookingDocument(record: DBStreamRecord, observer: Observer<boolean>) {
        this.elasticSearchClient.delete({
            index: this.BOOKING_INDEX,
            type: this.BOOKING_MAPPING,
            id: record.getKeys()[0].value,
        }, (err: any, resp: any) => {
            if (err) {
                console.error('failed to delete booking', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`removed document to book index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });
    }


    private constructInsertOnlyParams(record: DBStreamRecord): any {
        let uniqueObject = record.getAllUniqueProperties();
        // query candiate table based on candidate Id and get results and merge
        uniqueObject['dateOfExam'] = record.convertToDate(uniqueObject['dateOfExam']);
        uniqueObject['fullName'] = 'Kiran Kumar';
        uniqueObject['email'] = 'kiran@amitisoft.com';
        uniqueObject['candidateId'] = '2';

        console.log(`uniques ${JSON.stringify(uniqueObject)}`);
        return uniqueObject;
    }

    private constructUpdateOnlyParams(record: DBStreamRecord): any {

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

    private constructBookingESUpdates(record: DBStreamRecord): any {
        return {
            index: this.BOOKING_INDEX,
            type: this.BOOKING_MAPPING,
            id: record.getKeys()[0].value,
            body: {
                script: this.constructUpdateOnlyParams(record),
                upsert: this.constructInsertOnlyParams(record)
            }
        };
    }
}

