import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Candidate } from '../domain/candidate';
import { UtilHelper } from '../../api/util/util-helper';
import { v4 } from 'node-uuid';
import { DynamoDB, config, AWSError, Kinesis } from 'aws-sdk';
import { NotificationServiceImpl } from './notification-service';
import { Registration } from '../domain/registration';
import { PutRecordsResultEntry } from 'aws-sdk/clients/kinesis';
import { Client } from 'elasticsearch';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import moment = require('moment');
const AWS = require('aws-sdk');
const format = require('string-template');
const _ = require('lodash');

const async = require('async');
config.update({
    region: 'us-east-1'
});

export interface CandidateSearchParams {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    from: number;
    size: number;
}
export interface NotificationMessage {
    email: string;
    emailSubject: string;
    emailBody: string;
    token: string;
}

export interface RegisterCandidates {
    emails: string[];
    emailSubject: string;
    jobPosition: string;
    emailBody: string;
    category: string;
}


export interface RegisterCandidateInputParams {
    email: string;
    emailSubject: string;
    jobPosition: string;
    emailBody: string;
    category: string;
    candidate: Candidate;
    token: string;
}


@Injectable()
export class CandidateServiceImpl {

    private elasticSearchClient: Client;
    private CANDIDATE_INDEX = 'candidate_index';
    private CANDIDATE_MAPPING = 'candidate';

    constructor(private elasticSearchEndPoint: string, private region: string, private notificationServiceImpl: NotificationServiceImpl,
    private kinesisClient: Kinesis, private documentClient: DynamoDB.DocumentClient ) {
        console.log(`in CandidateServiceImpl constructor() notificationServiceImpl: ${notificationServiceImpl}`);
        console.log(`in CandidateServiceImpl constructor() kinesisClient: ${kinesisClient}`);
        this.elasticSearchClient = new Client({
            hosts: [elasticSearchEndPoint],
            log: 'trace'
        });

        AWS.config.update({
            region: region
        });
    }

    registerCandidatesAndEmailPostRegistration(params: RegisterCandidates): Observable<boolean> {
        console.log(`registerCandidatesAndEmailPostRegistration ${JSON.stringify(params)}`);

        let registrations = params.emails.map((email) => {
            let registation = new Registration();
            registation.email = email;
            registation.emailBody = params.emailBody;
            registation.emailSubject = params.emailSubject;
            registation.category = params.category;
            registation.jobPosition = params.jobPosition;
            return registation;
        });


        let streamInputRecords = registrations.map((registration, index) => {
            const encodedData = JSON.stringify(
                {
                    email: registration.email,
                    emailSubject: registration.emailSubject,
                    emailBody: registration.emailBody,
                    jobPosition: registration.jobPosition,
                    category: registration.category
                }
            );


            return {
                PartitionKey: registration.email,
                Data: encodedData,
            };
        });

        let kinesisParams = {
            StreamName: 'register-test-stream',
            Records: streamInputRecords
        };

        console.log(`kinesis records ${JSON.stringify(kinesisParams)}`);

        return Observable.create((observer: any) => {

            this.kinesisClient.putRecords(kinesisParams, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    observer.next(false);
                    return;
                }
                console.log(data); // successful response
                data.Records.forEach((record: PutRecordsResultEntry) => {
                    console.log(`record.SequenceNumber ${record.SequenceNumber}`);
                    console.log(`record.ShardId ${record.ShardId}`);
                });

                observer.next(true);
            });
        });
    }

    findCandidateByEmailId(email: string): Observable<Candidate> {
        console.log(`in CandidateServiceImpl isCandidateEmailExists() ${email}`);

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            IndexName: 'emailIndex',
            ProjectionExpression: 'candidateId',
            KeyConditionExpression: '#emailId = :emailIdFilter',
            ExpressionAttributeNames: {
                '#emailId': 'email'
            },
            ExpressionAttributeValues: {
                ':emailIdFilter': email
            }
        };

        return Observable.create((observer: any) => {
            this.documentClient.query(queryParams, (err: AWSError, data: DynamoDB.DocumentClient.QueryOutput) => {
                if (err) {
                    console.log(err);
                    return observer.error(err);
                }

                if (data.Items.length === 0) {
                    console.log(`Candiate doesn't exists with email ${email}`);
                    return observer.error(`Candiate doesn't exists with email ${email}`);
                } else {
                    observer.next(data.Items[0]);
                    observer.complete();
                    return;
                }
            });
        });
    }

    validateBookingForCandidate(params: RegisterCandidateInputParams): Observable<boolean> {
        console.log(`params in validateBooking ${JSON.stringify(params)}`);
        let date1 = new Date(new Date().getUTCDate());
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'booking',
            IndexName: 'candidateId-category-index',
            ProjectionExpression: 'bookingId,candidateId,category,dateOfExam',
            KeyConditionExpression: '#candidateId = :candidateIdFilter AND #category = :categoryFilter',
            FilterExpression: '#date < :dateFilter AND #testStatus <> :testStatusFilter',
            ExpressionAttributeNames: {
                '#candidateId': 'candidateId',
                '#category': 'category',
                '#date': 'dateOfExam',
                '#testStatus': 'testStatus'
            },
            ExpressionAttributeValues: {
                ':candidateIdFilter': params.candidate.candidateId,
                ':categoryFilter': params.category,
                ':dateFilter': 30,
                ':testStatusFilter': 'Taken'
            }
        };

        return Observable.create((observer: any) => {
                const queryCallBack$ = Observable.bindCallback(this.documentClient.query).bind(this.documentClient);
                const result = queryCallBack$(queryParams);
                result.subscribe(
                    (x: DynamoDB.Types.QueryOutput) => {
                        console.log(`validateBookingForCandidate ${JSON.stringify(x)}`);
                        if (x.Items && x.Items.length > 0) {
                            console.log(`validateBookingForCandidate failed ${x}`);
                            observer.next(false);
                        } else {
                            console.log(`validateBookingForCandidate succeeded ${x}`);
                            observer.next(true);
                        }
                        observer.complete();
                    },
                    e => {
                        console.log('error in validateBookingForCandidate');
                        // console.error(e);
                        observer.error(e);
                        return;
                    }
                );

            }
        );
    }

    registerCandidate(inputParams: RegisterCandidateInputParams): void {
        console.log(`received ${JSON.stringify(inputParams)}`);
        let that = this;
        const registrationWaterFall = UtilHelper.waterfall([
            function () {
                return that.findCandidateByEmailId(inputParams.email);
            },
            function (candidate: Candidate) {
                console.log('Candidate Received' + JSON.stringify(candidate));
                inputParams.candidate = candidate;
                return candidate ? that.validateBookingForCandidate(inputParams) :
                    Observable.throw(new Error('Candidate does not exist.'));
            },
            function (validated: boolean) {
                console.log(`in register validated ${validated}`);
                if (validated) {
                    const token = v4();
                    inputParams.token = token;
                    let uInput = {
                        token: inputParams.token,
                        candidateId: inputParams.candidate.candidateId
                    };
                    console.log(`calling updateCandidateInfo with ${JSON.stringify(uInput)}`);
                    return that.updateCandidateInfo(uInput);
                }
            },
            function (updatedCandidateSuccessfully: boolean) {
                if (updatedCandidateSuccessfully) {
                    console.log(`calling updateBookingInfo with ${JSON.stringify(inputParams)}`);
                    return that.updatedBookingInfo(inputParams);
                }
            }
        ]);
        registrationWaterFall.subscribe(
            function (x) {
                console.log(`registrationWaterFall result ${JSON.stringify(x)}`);
                that.doPostRegistrationTasks(inputParams);
            },
            function (err) {
                console.log(`registrationWaterFall failed ${err.stack}`);
            }
        );
    }


    updateCandidateInfo(result: any): Observable<boolean> {
        let that = this;
        return Observable.defer(() => {
            return Observable.fromPromise(that.updateCandidateInfoPromise(result));
        });
    }

    findById(candidateId: string): Observable<Candidate> {
        console.log('in CandidateServiceImpl find()');

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            ProjectionExpression: 'candidateId, firstName, lastName, email, phoneNumber',
            KeyConditionExpression: '#candidateId = :candidateIdFilter',
            ExpressionAttributeNames: {
                '#candidateId': 'candidateId'
            },
            ExpressionAttributeValues: {
                ':candidateIdFilter': candidateId
            }
        };

        return Observable.create((observer: Observer<Candidate>) => {
            console.log('Executing query with parameters ' + queryParams);
            this.documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if (data.Items.length === 0) {
                    console.log('no data received for getAll candidates');
                    observer.complete();
                    return;
                }
                data.Items.forEach((item) => {
                    console.log(`candidate Id ${item.candidateId}`);
                    console.log(`candidate firstName ${item.firstName}`);
                    console.log(`candidate lastName ${item.lastName}`);
                    console.log(`candidate email ${item.email}`);
                });
                observer.next(data.Items[0]);
                observer.complete();

            });
        });

    }


    getAll(): Observable<Candidate[]> {
        let that = this;

        console.log('in CandidateServiceImpl getAll()');
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            ProjectionExpression: 'candidateId, firstName, lastName, email,phoneNumber',
        };

        return Observable.create((observer: Observer<Candidate>) => {
            console.log('Executing query with parameters ' + queryParams);
            this.documentClient.scan(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if (data.Items.length === 0) {
                    console.log('no data received for getAll candidates');
                    observer.complete();
                    return;
                }
                data.Items.forEach((item) => {
                    console.log(`candidate Id ${item.candidateId}`);
                    console.log(`candidate firstName ${item.firstName}`);
                    console.log(`candidate lastName ${item.lastName}`);
                    console.log(`candidate email ${item.email}`);
                });
                observer.next(data.Items);
                observer.complete();

            });

        });

    }

    /**
     *  insert candidate information into db
     *      first we check emailId is exist or not
     *      if not exist put candidate information into db
     * @param inputParams
     */
    insertCandidate(inputParams: any): Observable<string> {
        console.log(`received ${JSON.stringify(inputParams)}`);
        let that = this;
        return Observable.create((observer: Observer<string>) => {
            const registrationWaterFall = UtilHelper.waterfall([
                function () {
                    let checkDuplicates = that.checkDuplicateEmailId(inputParams.email);
                    return checkDuplicates;
                },
                function (checkduplicate: boolean) {
                    if (checkduplicate && inputParams.candidateId === undefined) {
                        return 'f';
                    } else {
                        return that.updateCandidateTable(inputParams);
                    }
                }
            ]);
            let message = '';
            registrationWaterFall.subscribe(
                function (x) {
                    if (x === 'f') {
                        observer.next('Email ID already exist');
                        observer.complete();
                        return;

                    } else {
                        console.log(`water fall output = ${x}`);
                        console.log('x = ', x.toString());
                        observer.next(x.toString());
                        // observer.next('Successfully inserted data');
                        observer.complete();
                        return;
                    }
                },
                function (err) {
                    message = err;
                    console.log(`registrationWaterFall failed ${err.stack}`);
                    observer.error(err);
                    return;
                }
            );
        });
    }

    /**
     * candidate email duplicate check
     * true == eamilID is already exist
     * false == eamilID is not exist
     */

    checkDuplicateEmailId(email: any): Observable<boolean> {
        console.log(`in  isCandidateEmailExists() ${email}`);

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'candidate',
            IndexName: 'emailIndex',
            ProjectionExpression: 'candidateId',
            KeyConditionExpression: '#emailId = :emailIdFilter',
            ExpressionAttributeNames: {
                '#emailId': 'email'
            },
            ExpressionAttributeValues: {
                ':emailIdFilter': email
            }
        };

        return Observable.create((observer: any) => {
            this.documentClient.query(queryParams, (err: AWSError, data: DynamoDB.DocumentClient.QueryOutput) => {
                if (err) {
                    console.log(err);
                    return observer.error(err);
                }

                if (data.Items.length === 0) {
                    console.log(`Candiate doesn't exists with email ${email}`);
                    observer.next(false);
                    observer.complete();
                    return;
                } else {
                    observer.next(true);
                    observer.complete();
                    return;
                }
            });
        });

    }

    /**
     *
     */

    updateCandidateTable(data: any): Observable<string> {
        console.log('#########', data);
        //  data = JSON.parse(JSON.stringify(data));
        let candidateIdUuid = v4();
        if (data.candidateId !== undefined) {
            candidateIdUuid = data.candidateId;
        }
        const params = {
            TableName: 'candidate',
            Key: {
                candidateId: candidateIdUuid,
            },
            ExpressionAttributeNames: {
                '#fn': 'firstName',
                '#ln': 'lastName',
                '#email': 'email',
                '#pn': 'phoneNumber'
            },
            ExpressionAttributeValues: {
                ':fn': data.firstName,
                ':ln': data.lastName,
                ':email': data.email,
                ':pn': data.phoneNumber,
            },
            UpdateExpression: 'SET #fn = :fn,#ln=:ln, #email = :email, #pn= :pn',
            ReturnValues: 'ALL_NEW',
        };

        return Observable.create((observer: Observer<string>) => {

            this.documentClient.update(params, (err, result: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                } else if (data.candidateId === undefined) {
                         observer.next('Successfully inserted data');
                        observer.complete();
                } else {
                     console.log(`result ${JSON.stringify(result)}`);
                    observer.next('Successfully updated data');
                    observer.complete();
                }
            });
        });
    }


    /**
     * get candidate
     */
    getCandidateInfoForView(data: any): Observable<Candidate> {
        const queryParams: DynamoDB.Types.GetItemInput = {
            TableName: 'candidate',
            ProjectionExpression: 'candidateId, firstName, lastName, email,phoneNumber',
            Key: {
                'candidateId': data.id
            }
        };

        return Observable.create((observer: Observer<Candidate>) => {
            console.log('Executing query with parameters ' + queryParams);
            this.documentClient.get(queryParams, (err, result: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${result}`);
                observer.next(result.Item);
                observer.complete();

            });
        });
    }
    /**
     * insert or delete or update data to elastic search
     * @param record
     */

     updateCandidateTOElasticSearch(record: DBStreamRecord): Observable<boolean> {
        let that = this;
        return Observable.create((observer: Observer<boolean>) => {
            let candidateIndexMappingFlow = UtilHelper.waterfall([
                function () {
                    return that.checkIfCandidateIndexExists();
                },
                function (isBookingExists) {
                    return isBookingExists ? Observable.from([true]) :
                        that.createCandidateMapping(isBookingExists);
                }
            ]);
            candidateIndexMappingFlow.subscribe(
                function (x) {
                    console.log('candidate index and mapping successfully created');
                    switch (record.getEventName()) {
                        case 'INSERT':
                            that.updateCandidateDocument(record, observer);
                            break;
                        case 'UPDATE':
                            that.updateCandidateDocument(record, observer);
                            break;
                        case 'DELETE':
                            that.deleteCandidateDocument(record, observer);
                            break;
                        case 'MODIFY':
                             that.updateCandidateDocument(record, observer);
                            break;
                        case 'REMOVE':
                            that.deleteCandidateDocument(record, observer);
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
/**
 * candidate search by email or firstName or lastName or phone number
 * @param params
 */
findESCandidateSearchResult(params: CandidateSearchParams): Observable<Candidate[]> {
        let email = format('{0}', params.email);
        let emailCondition: any = params.email ? {
            'term': {
                email
            }
        } : undefined;

        let firstName = format('{0}', params.firstName);
        let firstNameCondition: any = params.firstName ? {
            'match': {
                firstName
            }
        } : undefined;

        let lastName = format('{0}', params.lastName);
        let lastNameCondition: any = params.lastName ? {
            'match': {
                lastName
            }
        } : undefined;

        let phoneNumber = format('{0}', params.phoneNumber);
        let phoneNumberCondition: any = params.phoneNumber ? {
              'match': {
                  phoneNumber
              }
        } : undefined;

        let mustConditions = [
            emailCondition,
            firstNameCondition,
            lastNameCondition,
            phoneNumberCondition
        ];


        const filteredMustConditions = _.without(mustConditions, undefined);

        return Observable.create((observer: any) => {
            this.elasticSearchClient.search({
                from: params.from,
                size: params.size,
                index: this.CANDIDATE_INDEX,
                type: this.CANDIDATE_MAPPING,
                body: {
                    query: {
                        'bool': {
                            'must': filteredMustConditions
                        }
                    }
                }
            }, (err: any, resp: any) => {
                if (err) {
                    console.error(`Failed to read canidate progress information ${err}`);
                    observer.error(err);
                    return;
                }
                console.log(`search finished for progress ${resp}`);
                const candidateSearchResult = resp.hits.hits.map(hit => {

                    const candidateInfo = hit._source;
                    const result: Candidate = {
                        candidateId: candidateInfo.candidateId,
                        firstName: candidateInfo.firstName,
                        email: candidateInfo.email,
                        lastName: candidateInfo.lastName,
                        phoneNumber: candidateInfo.phoneNumber
                    };
                    return result;
                });
                observer.next(candidateSearchResult);
                observer.complete();
            });

        });
    }

     private createCandidateMapping(bookingExists: boolean): Observable<boolean> {
        console.log('in createBookingMapping');
        return Observable.create((observer: Observer<boolean>) => {
            if (!bookingExists) {
                this.elasticSearchClient.indices.create({
                    index: this.CANDIDATE_INDEX,
                    body: {
                        'mappings': {
                            'candidate': {
                                'properties': {
                                    'candidateId': {
                                        'type': 'keyword'
                                    },
                                    'firstName': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'lastName': {
                                        'type': 'text',
                                        'index': 'true'
                                    },
                                    'email': {
                                        'type': 'keyword',
                                        'index': 'true'
                                    },
                                    'phoneNumber': {
                                        'type': 'long'
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
                    console.log(`create candidateMapping response ${JSON.stringify(response)}`);
                    console.log(`createcandidate Mapping status ${JSON.stringify(status)}`);
                    observer.next(true);
                    observer.complete();
                });
            } else {
                observer.next(true);
                observer.complete();
            }


        });
    }

 private checkIfCandidateIndexExists(): Observable<boolean> {
        let that = this;
        return Observable.create((observer: Observer<boolean>) => {
            this.elasticSearchClient.indices.exists({
                index: this.CANDIDATE_INDEX
            }, (error: any, response: any, status: any) => {
                if (error) {
                    console.log('Candidate INDEX DOESNT EXISTS');
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
    private updateCandidateDocument(record: DBStreamRecord, observer: Observer<boolean>): void {
        let updateParams = this.constructCandidateESUpdates(record);

        this.elasticSearchClient.update(updateParams, (err: any, resp: any) => {
            if (err) {
                console.error('failed to add/update candidate', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`added document to candidate index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });

    }

    private deleteCandidateDocument(record: DBStreamRecord, observer: Observer<boolean>) {
        this.elasticSearchClient.delete({
            index: this.CANDIDATE_INDEX,
            type: this.CANDIDATE_MAPPING,
            id: record.getKeys()[0].value,
        }, (err: any, resp: any) => {
            if (err) {
                console.error('failed to delete candidate', err);
                if (err.statusCode !== 404) {
                    observer.error({});
                    return;
                }
            }
            if (!err) {
                console.log(`removed document to candidate index ${resp}`);
                observer.next(true);
                observer.complete();
            }
        });
    }

    private constructInsertOnlyParams(record: DBStreamRecord): any {
        let uniqueObject = record.getAllUniqueProperties();
        // uniqueObject['fullName'] = 'Kiran Kumar';
        // uniqueObject['email'] = 'kiran@amitisoft.com';
        // uniqueObject['candidateId'] = '2';

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
        console.log(`Queries==================== ${queries}`);
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

    private constructCandidateESUpdates(record: DBStreamRecord): any {
        return {
            index: this.CANDIDATE_INDEX,
            type: this.CANDIDATE_MAPPING,
            id: record.getKeys()[0].value,
            body: {
                script: this.constructUpdateOnlyParams(record),
                upsert: this.constructInsertOnlyParams(record)
            }
        };
    }

    private doPostRegistrationTasks(inputParams: RegisterCandidateInputParams) {
        let message = {
            email: inputParams.email,
            emailSubject: inputParams.emailSubject,
            emailBody: inputParams.emailBody,
            token: inputParams.token
        };
        this.publishSendEmailMessage(message);
    }

    private publishSendEmailMessage(message: NotificationMessage) {
        try {
            this.notificationServiceImpl.sendRegistrationEmail(message)
                .subscribe(
                    function (x) {
                        console.log(`email result ${JSON.stringify(x)}`);
                    },
                    function (err) {
                        console.log(`email failed ${err}`);
                    }
                );
        } catch (e) {

        }
    }

    private updatedBookingInfo(inputParams: RegisterCandidateInputParams): Observable<boolean> {
        return Observable.create((observer) => {
            const testStatus = 'NotTaken';
            const params = {
                TableName: 'booking',
                Key: {
                    bookingId: v4()
                },
                ExpressionAttributeNames: {
                    '#cid': 'candidateId',
                    '#ct': 'category',
                    '#jp': 'jobPosition',
                    '#ts': 'testStatus'
                },
                ExpressionAttributeValues: {
                    ':cid': inputParams.candidate.candidateId,
                    ':ct': inputParams.category,
                    ':jp': inputParams.jobPosition,
                    ':ts': testStatus
                },
                UpdateExpression: 'SET #cid=:cid,#ct=:ct,#jp=:jp, #ts=:ts',
                ReturnValues: 'ALL_NEW'
            };
            this.documentClient.update(params, (err, data: any) => {
                if (err) {
                    console.error(err);
                    observer.error(err);
                    return;
                }
                console.log(`Created Booking for Candidate ${inputParams.candidate.candidateId}`);
                observer.next(true);
                observer.complete();
            });
        });
    }

    private updateCandidateInfoPromise(result: any) {
        return new Promise(function (resolve, reject) {
            const params = {
                TableName: 'candidate',
                Key: {
                    candidateId: result.candidateId
                },
                ExpressionAttributeNames: {
                    '#tok': 'token'
                },
                ExpressionAttributeValues: {
                    ':tok': result.token
                },
                UpdateExpression: 'SET #tok=:tok'
            };
            this.documentClient.update(params, (err, data: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log('update the TokenId in Candidate Table', result);
                resolve(true);

            });
        });
    }


    private convertToKinesisRecord(streamInputRecords: any[]): any[] {
        return streamInputRecords.map((streamInputRecord) => {
            console.log(`streamInputRecord ${JSON.stringify(streamInputRecord)}`);
            return {
                'record': {
                    'kinesis': {
                        'partitionKey': streamInputRecord.PartitionKey,
                        'sequenceNumber': streamInputRecord.PartitionKey,
                        'data': new Buffer(JSON.stringify(streamInputRecord.Data), 'ascii').toString('base64')
                    }
                }
            };
        });
    }
}
