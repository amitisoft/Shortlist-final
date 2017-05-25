import { Observable, Observer } from'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Booking } from '../domain/booking';
import { Client } from 'elasticsearch';
import { Candidate } from '../domain/candidate';
import { DynamoDB } from 'aws-sdk';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { UtilHelper } from '../../api/util/util-helper';
import { CandidateServiceImpl } from './candidate-service';
import moment = require('moment');
const bodybuilder = require('bodybuilder');
const AWS = require('aws-sdk');
const format = require('string-template');
const _ = require('lodash');

export interface URIInputPahtParams {
    testLinkInfo: string;
}

export interface TimeSlotParams {
    bookingId:string;
    startingTime:string;
   }


export interface BookingSearchParams {
    testStatus?: string;
    fullName?: string;
    paperType?: string;
    category?: string;
    email?: string;
    dateOfExamRange?: string;
    from: number;
    size: number;
}


@Injectable()
export class BookingServiceImpl {

    elasticSearchClient: Client;
    BOOKING_INDEX = 'booking_index';
    BOOKING_MAPPING = 'booking';


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


    /**
     * isTestLinkStatusInfo()
     * Candidate click on TestLink Before test
     * testStatus is " progress" send Booking Information
     * @param pathParameter
     */

      isTestLinkStatusInfo(pathParameter:URIInputPahtParams): Observable<Booking> {
        let that = this;
        return Observable.create((observer: Observer<Booking>) => {
            const registrationWaterFall = UtilHelper.waterfall([
                function () {
                return that.bookingTestStatusInfo(pathParameter.testLinkInfo);
                    },
                function (bookingData: Booking) {
                    return that.candidateTokenChecking(bookingData,pathParameter.testLinkInfo)
                }
            ]);
        registrationWaterFall.subscribe(
                function (x) {
                let temp = JSON.parse(JSON.stringify(x));
                //console.log("Booking values = ",x);
                  observer.next(temp);
                  observer.complete();  
                },
                function (err) {
                    console.log(`error message ${err}`);
                    observer.error(err);
                    return;
                }
            );
        });
    }

     /**
     *  bookingTestStatusInfo
     */
   
     bookingTestStatusInfo(pathParameter: string): Observable<Booking> {
        let decodedData = JSON.parse(new Buffer(pathParameter, 'base64').toString('ascii'));
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
             ProjectionExpression: 'candidateId,bookingId,testStatus,paperType,category',
             ScanIndexForward: false
         };
             return Observable.create((observer: Observer<any>) => {
             this.documentClient.query(queryParams, (err, data: any) => {
                 if (err) {
                     observer.error(err);
                     throw err;
                 }
                 if (data.Items.length === 0) {
                    observer.complete();
                    return;
                }
                 // check testStatus
                 console.log('testStatus', data);
                 if(data.Items[0].testStatus === 'NotTaken') {
                     observer.next(data.Items[0]);
                     observer.complete();
                     return;
                 }else if(data.Items[0].testStatus === 'Completed'){
                   let msg="Exam Already Done";
                   observer.next(msg);
                   observer.complete();
                    return;
                   }
                 else
                 {
                     observer.next(data.Items[0]);
                     observer.complete();
                     return;
                 }
             });
         });
     }


       /**
     *  checking candidate Token
     */
    candidateTokenChecking(data, pathParameter): Observable<Booking> {
        let decodedData = JSON.parse(new Buffer(pathParameter, 'base64').toString('ascii'));
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            KeyConditionExpression: '#candidateId = :candidateId',
            ExpressionAttributeNames: {
                '#candidateId': 'candidateId'
            },
            ExpressionAttributeValues: {
                ':candidateId': data.candidateId
            },
            ProjectionExpression: 'candidateId, tokenId',
            ScanIndexForward: false
        };

        return Observable.create((observer: Observer<any>) => {
            this.documentClient.query(queryParams, (err, data1: any) => {
                if (err) {
                    observer.error(err);
                    throw err;
                }
                // check token
                console.log('token data', data1.Items);
                if (data1.Items[0].tokenId === decodedData.tokenId) {
                    observer.next(data);
                    observer.complete();
                    return;
                }
                else
                {
                   let msg="Candidate token miss matched";
                   observer.next(msg);
                    observer.complete();
                    return;
                }
                //observer.error('Candidate token miss matched');
                //observer.complete();
                //return 'Candidate token miss matched';
                    
            });
        });
    }

   
      updateExamTimingSlots(data:TimeSlotParams):Observable<string>{
        console.log('in BookingServiceImpl updateExamTimingSlots()');
        console.log(`data received ${ data.bookingId }`);
        console.log(`data received ${ data.startingTime}`);
        //let finishedTime = new Date ( data.startingTime );
        //finishedTime.setMinutes ( finishedTime.getMinutes() + 30 );
         let etime= new Date (data.startingTime).getTime()+(30*60*1000);
            const params = {
            TableName: 'booking',
            Key: {
                bookingId: data.bookingId,
                 },
            ExpressionAttributeNames: {
                '#stime': 'startingTime',
                '#etime': 'endingTime'
            },                
            ExpressionAttributeValues: {
                ':stime': data.startingTime,
                ':etime':  etime             //finishedTime.toISOString()
                },
            UpdateExpression: 'SET #stime = :stime,#etime=:etime',
            ReturnValues: 'ALL_NEW',
        };
        return Observable.create((observer: Observer<string>) => {
            this.documentClient.update(params, (err, result: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                }
                //console.log(`result ${ JSON.stringify(data) }`);
                observer.next("success");
                observer.complete();
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
    // candidateTokenChecking(data, pathParameter): any {
    //     let decodedData = JSON.parse(new Buffer(pathParameter.candidateinfo, 'base64').toString('ascii'));
    //     const queryParams: DynamoDB.Types.QueryInput = {
    //         TableName: 'candidate',
    //         KeyConditionExpression: '#candidateId = :candidateId',
    //         ExpressionAttributeNames: {
    //             '#candidateId': 'candidateId'
    //         },
    //         ExpressionAttributeValues: {
    //             ':candidateId': data.candidateId
    //         },
    //         ProjectionExpression: 'candidateId, token',
    //         ScanIndexForward: false
    //     };

    //     return Observable.create((observer: Observer<Booking>) => {
    //         this.documentClient.query(queryParams, (err, data1: any) => {
    //             if (err) {
    //                 observer.error(err);
    //                 throw err;
    //             }
    //             // check token
    //             console.log('token data', data1.Items);
    //             if (data1.Items[0].token === decodedData.token) {
    //                 observer.next((data));
    //                 observer.complete();
    //                 return;
    //             }
    //             observer.error('Candidate token miss matched');
    //             return 'Candidate token miss matched';
    //         });
    //     });
    // }

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

                    return candidate != null ? Observable.from([true]) :
                        Observable.throw(new Error('Candidate does not exist.'));
                },
                function (dependecySatisfied) {
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

    createBookingMapping(bookingExists: boolean): Observable<boolean> {
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

    checkIfBookingIndexExists(): Observable<boolean> {
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

    upsertBookingIndex(record: DBStreamRecord, observer: Observer<boolean>): void {
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

    deleteBookingDocument(record: DBStreamRecord, observer: Observer<boolean>) {
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

    constructBookingESUpdates(record: DBStreamRecord): any {
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


    getESTestNotTakenResults(): Observable<Booking[]> {
        return Observable.create((observer: any) => {
            this.elasticSearchClient.search({
                index: this.BOOKING_INDEX,
                type: this.BOOKING_MAPPING,
                body: {
                    query: {
                        'bool': {
                            'must': [
                                {
                                    'match': {
                                        'testStatus': 'not taken'
                                    }
                                }
                            ]
                        }
                    }
                }

            }, (err: any, resp: any) => {
                if (err) {
                    console.error(`Failed to read booking not taken information ${err}`);
                    observer.error(err);
                    return;
                }
                console.log(`search finished for not taken ${resp}`);
                const bookingWhichNotTaken = resp.hits.hits.map(hit => {

                    const bookingInfo = hit._source;
                    const result: any = {
                        candidateId: bookingInfo.candidateId,
                        bookingId: bookingInfo.bookingId,
                        category: bookingInfo.category,
                        jobPosition: bookingInfo.jobPosition,
                        dateOfExam: bookingInfo.dateOfExam,
                        paperType: bookingInfo.paperType,
                        testStatus: bookingInfo.testStatus,
                        fullName: bookingInfo.fullName
                    };
                    return result;
                });
                observer.next(bookingWhichNotTaken);
                observer.complete();
            });

        });
    }

    getESTestInProgressResults(): Observable<Booking[]> {
        return Observable.create((observer: any) => {
            this.elasticSearchClient.search({
                index: this.BOOKING_INDEX,
                type: this.BOOKING_MAPPING,
                body: {
                    query: {
                        'bool': {
                            'must': [
                                {
                                    'match': {
                                        'testStatus': 'progress'
                                    }
                                }
                            ]
                        }
                    }
                }

            }, (err: any, resp: any) => {
                if (err) {
                    console.error(`Failed to read booking progress information ${err}`);
                    observer.error(err);
                    return;
                }
                console.log(`search finished for progress ${resp}`);
                const bookingWhichNotTaken = resp.hits.hits.map(hit => {

                    const bookingInfo = hit._source;
                    const result: any = {
                        candidateId: bookingInfo.candidateId,
                        bookingId: bookingInfo.bookingId,
                        category: bookingInfo.category,
                        jobPosition: bookingInfo.jobPosition,
                        dateOfExam: bookingInfo.dateOfExam,
                        paperType: bookingInfo.paperType,
                        testStatus: bookingInfo.testStatus,
                        fullName: bookingInfo.fullName,
                        email: bookingInfo.email
                    };
                    return result;
                });
                observer.next(bookingWhichNotTaken);
                observer.complete();
            });

        });
    }

    findESBookingSearchResult(params: BookingSearchParams): Observable<Booking[]> {
        let email = format('{0}', params.email);
        let emailCondition: any = params.email ? {
            'term': {
                email
            }
        } : undefined;


        let testStatus = format('{0}', params.testStatus);
        let testStatusCondition: any = params.testStatus ? {
            'term': {
                testStatus
            }
        } : undefined;

        let paperType = format('{0}', params.paperType);
        let paperTypeCondition: any = params.paperType ? {
            'term': {
                paperType
            }
        } : undefined;

        let fullName = format('{0}', params.fullName);
        let fullNameCondition: any = params.fullName ? {
            'match': {
                fullName
            }
        } : undefined;

        let category = format('{0}', params.category);
        let categoryCondition: any = params.category ? {
            'match': {
                category
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
            testStatusCondition,
            paperTypeCondition,
            fullNameCondition,
            categoryCondition
        ];


        const filteredMustConditions = _.without(mustConditions, undefined);

        return Observable.create((observer: any) => {
            this.elasticSearchClient.search({
                from: params.from,
                size: params.size,
                index: this.BOOKING_INDEX,
                type: this.BOOKING_MAPPING,
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
                    console.error(`Failed to read booking progress information ${err}`);
                    observer.error(err);
                    return;
                }
                console.log(`search finished for progress ${resp}`);
                const bookingWhichNotTaken = resp.hits.hits.map(hit => {

                    const bookingInfo = hit._source;
                    const result: any = {
                        candidateId: bookingInfo.candidateId,
                        bookingId: bookingInfo.bookingId,
                        category: bookingInfo.category,
                        jobPosition: bookingInfo.jobPosition,
                        dateOfExam: bookingInfo.dateOfExam,
                        paperType: bookingInfo.paperType,
                        testStatus: bookingInfo.testStatus,
                        fullName: bookingInfo.fullName,
                        email: bookingInfo.email
                    };
                    return result;
                });
                observer.next(bookingWhichNotTaken);
                observer.complete();
            });

        });
    }
     getFinsihExamTimeByBookingId(bId:string): any {
         console.log("bookingId",bId);
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            KeyConditionExpression: '#bookingId = :bookingId',
            ExpressionAttributeNames: {
                '#bookingId': 'bookingId'
            },
            ExpressionAttributeValues: {
                ':bookingId':bId
            },
            ProjectionExpression: 'endingTime,startingTime',
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
                 observer.next((result.Items[0]));
                 observer.complete();
                    return;
               });
        });
    }
}

