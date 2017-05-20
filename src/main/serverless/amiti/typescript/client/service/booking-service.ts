import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Booking } from '../domain/booking';
import { DynamoDB, SES, SNS } from 'aws-sdk';
import { Client } from 'elasticsearch';
import DocumentClient = DynamoDB.DocumentClient;
import { DBStreamRecord, StreamObject } from '../../api/stream/booking-db-stream-record-impl';

import UpdateDocumentParams = Elasticsearch.UpdateDocumentParams;

const AWS = require('aws-sdk');
const format = require('string-template');
const _ = require('lodash');

@Injectable()
export class BookingServiceImpl {

    private elasticSearchClient: Client;
    private BOOKING_INDEX = 'booking_index';
    private BOOKING_MAPPING = 'booking';


    constructor(private elasticSearchEndPoint: string, private region: string) {
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
    isLinkActive(pathParameter: any): Observable<boolean> {
        let decodedData = JSON.parse(new Buffer(pathParameter.testLinkinfo, 'base64').toString('ascii'));
        console.log('in is active method', decodedData.bookingId);
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            KeyConditionExpression: '#bookingId = :bookingIdData',
            ExpressionAttributeNames: {
                '#bookingId': 'bookingId',
            },
            ExpressionAttributeValues: {
                ':bookingIdData': decodedData.bookingId,
            },
            ProjectionExpression: 'candidateId,bookingId,testStatus',
            ScanIndexForward: false
        };
        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<boolean>) => {
            documentClient.query(queryParams, (err, data: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                // check testStatus
                console.log('testStatus', data);
                if (data.Items[0].testStatus === 'NotTaken') {
                    observer.next(false);
                    observer.complete();
                    return;
                }
            });
        });
    }

    /**
     * updateBookingAfterStartTest
     * Hr click on starttest button
     * @param data
     */
    updateBookingAfterStartTest(data: any): Observable<Booking> {
        console.log('in CandidateServiceImpl update()');
        console.log(`data received ${data.category}`);
        console.log(`data received ${data.jobPostion}`);
        console.log(`data received ${data.DOE}`);
        console.log(`data received ${data.paperType}`);

        const documentClient = new DocumentClient();
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

            documentClient.update(params, (err, result: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                }
                console.log(`result ${JSON.stringify(result)}`);
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
            Limit: 2,
            ProjectionExpression: 'candidateId, category,testStatus,bookingId,jobPosition',
            ScanIndexForward: false
        };

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

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Booking>) => {
            documentClient.query(queryParams, (err, data: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
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


    /**
     * get candidate information
     *
     */

    getAllCandidateInfoWhoNotTakenTest(data: any): Observable<Booking[]> {
        const candidateKey = [];
        data.forEach((item) => {
            let myObj = {'candidateId': item.candidateId};
            candidateKey.push(myObj);
        });
        console.log('out side');
        const params = {
            RequestItems: {
                'candidate': {
                    Keys: candidateKey,
                    ProjectionExpression: 'email,firstName,lastName,candidateId'
                }
            }
        };
        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Booking>) => {
            documentClient.batchGet(params, function (err, data1) {
                if (err) {
                    observer.error(err);
                    throw err;
                }

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
                    bookinginfo.fullName = `${newArray[0].firstName} ${newArray[0].lastName}`;
                    bookinginfo.email = newArray[0].email;
                    bookinginfo.jobPosition = item.jobPosition;
                    resultArray.push(bookinginfo);
                    //  console.log(' result', bookinginfo);
                    //     }

                });
                observer.next(resultArray);
                observer.complete();

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

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Booking>) => {
            documentClient.query(queryParams, (err, result: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                if (result.Items.length === 0) {
                    observer.complete();
                    return;
                }
                // check testStatus
                console.log('test status', result.Items[0].testStatus);
                if (data.Items[0].testStatus === 'progress') {
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

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Booking>) => {
            documentClient.query(queryParams, (err, data1: any) => {
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


    updateBookingToElasticSearch(record: DBStreamRecord): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {

            console.log(`record updating ${JSON.stringify(record)}`);
            switch (record.getEventName()) {
                case 'INSERT':
                    break;
                case 'UPDATE':
                    break;
                case 'DELETE':
                    break;
                default:
                    break;
            }

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

            // this.elasticSearchClient.ping({
            //     // ping usually has a 3000ms timeout
            //     requestTimeout: 1000
            // }, function (error) {
            //     if (error) {
            //         console.log('elasticsearch cluster is down!');
            //         observer.error('elasticsearch cluster is down!');
            //     } else {
            //         console.log('All is well');
            //         observer.next(true);
            //         observer.complete();
            //     }
            // });

        });
    }


    // check Candidate ID exist or not in Booking table
    findByCandidateId(candidateId: string, reqdata: any): Observable<any> {
        console.log('in BookingServiceImpl findByCandidateId()');
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            IndexName: 'candidateIdGSI',
            ProjectionExpression: 'category,dateofExam,jobPosition,bookingId,testStatus',
            KeyConditionExpression: '#candidateId = :candidateIdFilter',
            ExpressionAttributeNames: {
                '#candidateId': 'candidateId'
            },
            ExpressionAttributeValues: {
                ':candidateIdFilter': candidateId
            }
        };
        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<any>) => {
            console.log('Executing query with parameters ' + queryParams);
            documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                /**
                 *  CandidateId is not exist in the Booking Table consider as a frehser  then book the slot.
                 */
                if (data.Items.length === 0) {
                    console.log(` this candidateID  ${candidateId} is not Exist in the Booking Table  `);
                    return;
                } else {

                }

            });
        });
    }

    // Before send  a mail: step 2->  Update the tokenid in Candidate table based on CandidateID
    updateCandidateInfo(result: any) {
        console.log(`Update the tokenId :${result.token} in candidate table `);
        const documentClient = new DocumentClient();
        const params = {
            TableName: 'candidate',
            Key: {
                candidateId: result.candidateId,
            },
            ExpressionAttributeNames: {
                '#tok': 'tokenId'
            },
            ExpressionAttributeValues: {
                ':tok': result.token
            },
            UpdateExpression: 'SET #tok=:tok',
            ReturnValues: 'ALL_NEW',
        };

        return new Promise(function (resolve, reject) {
            documentClient.update(params, (err, data: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve({result: result});
            });
        });
    }

    // Before Sending a mail, Step->1 Update Booking table - bookingid,candidateid,category,jobposition
    updateBookingInfo(bookingId: string, candidateId: string, token: string, category: string, jobPosition: string, emailids: any, emailsubject: string, emailbody: any) {
        console.log(' update the information in Booking');
        console.log(`data received CandidateId : ${candidateId}`);
        console.log(`data received Category :${category}`);
        console.log(`data received jobPosition :${jobPosition}`);
        console.log(`data received bookingId :${bookingId}`);

        let testStatus = 'notTaken';
        const documentClient = new DocumentClient();
        const params = {
            TableName: 'booking',
            Key: {
                bookingId: bookingId,
            },
            ExpressionAttributeNames: {
                '#cid': 'candidateId',
                '#ct': 'category',
                '#jp': 'jobPosition',
                '#ts': 'testStatus'
            },
            ExpressionAttributeValues: {
                ':cid': candidateId,
                ':ct': category,
                ':jp': jobPosition,
                ':ts': testStatus
            },
            UpdateExpression: 'SET #cid=:cid,#ct=:ct,#jp=:jp, #ts=:ts',
            ReturnValues: 'ALL_NEW',
        };
        return new Promise(function (resolve, reject) {
            documentClient.update(params, (err, data: any) => {
                if (err) {
                    console.log(err);
                    reject('data is not inserted');
                } else {
                    console.log('updated booking Information in Booking Table');
                    resolve({candidateId, token, emailids, emailsubject, emailbody});
                }
            });
        });
    }

    private constructInsertOnlyParams(record: DBStreamRecord): any {
        let uniqueObject = record.getAllUniqueProperties();
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
            params[obj['key']] = obj['value'];
        });

        let updateOnly = {
            inline: queries,
            params: params
        };

        console.log(`updateOnly ${JSON.stringify(updateOnly)}`);
        return updateOnly;
    }

    private constructBookingESUpdates(record: DBStreamRecord): UpdateDocumentParams {

        let params = {
            index: this.BOOKING_INDEX,
            type: this.BOOKING_MAPPING,
            id: record.getKeys()[0].value,
            body: {
                script: this.constructUpdateOnlyParams(record),
                upsert: this.constructInsertOnlyParams(record)
            }
        };
        return params;
    }
}

