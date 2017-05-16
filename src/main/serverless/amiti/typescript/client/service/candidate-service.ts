import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {Candidate} from '../domain/candidate';

import {UtilHelper} from "../../api/util/util-helper";
import {v4} from "node-uuid";

import {DynamoDB, config, AWSError, Kinesis} from "aws-sdk";
import es from 'event-stream';

const async = require('async');

import DocumentClient = DynamoDB.DocumentClient;
import {NotificationServiceImpl} from "./notification-service";
import {Registration} from "../domain/registration";
import {PartitionKey, PutRecordsRequestEntry, PutRecordsResultEntry} from "aws-sdk/clients/kinesis";
import {StreamRecord, StreamRecordImpl} from "../../api/stream/stream-record-impl";

config.update({
    region: " us-east-1"
});
const kinesis = new Kinesis(config);
export interface NotificationMessage {
    email: string;
    emailSubject: string;
    emailBody: string;
    token: string
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
    candidate: Candidate
    token: string
}


@Injectable()
export class CandidateServiceImpl {

    constructor(private notificationServiceImpl: NotificationServiceImpl) {
        console.log("in CandidateServiceImpl constructor()");
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
            }
        });

        let kinesisParams = {
            StreamName: "register-test-stream",
            Records: streamInputRecords
        }

        console.log(`kinesis records ${JSON.stringify(kinesisParams)}`);

        return Observable.create((observer: any) => {

            kinesis.putRecords(kinesisParams, function (err, data) {
if (err) {
console.log(err, err.stack);
observer.next(false);
return;
} // an error occurred
else {
console.log(data); // successful response
data.Records.forEach((record: PutRecordsResultEntry) => {
console.log(`record.SequenceNumber ${record.SequenceNumber}`)
console.log(`record.ShardId ${record.ShardId}`)
})

observer.next(true);
}
observer.complete();
});
            // const kinesisCallBack$ = Observable.bindCallback(kinesis.putRecords).bind(kinesis);
            // const result = kinesisCallBack$(kinesisParams);
            // console.log(`111111 ${JSON.stringify(result)}`);
            // result.subscribe(
            //     (x) => {
            //         x.Records.forEach((record: PutRecordsResultEntry) => {
            //             console.log(`record.SequenceNumber ${record.SequenceNumber}`)
            //             console.log(`record.ShardId ${record.ShardId}`)
            //         })

            //         observer.next(true);
            //         observer.complete();
            //     },
            //     e => {
            //         console.log("error in sending records to Kinesis stream")
            //         console.error(e);
            //         observer.error(e);
            //         return;
            //     }
            // );
        });
    }

    findCandidateByEmailId(email: string): Observable<Candidate> {
        console.log(`in CandidateServiceImpl isCandidateEmailExists() ${email}`);

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "candidate",
            IndexName: "emailIndex",
            ProjectionExpression: "candidateId",
            KeyConditionExpression: "#emailId = :emailIdFilter",
            ExpressionAttributeNames: {
                "#emailId": "email"
            },
            ExpressionAttributeValues: {
                ":emailIdFilter": email
            }
        }

        const documentClient: DocumentClient = new DocumentClient();

        return Observable.create((observer: any) => {
            documentClient.query(queryParams, (err: AWSError, data: DynamoDB.DocumentClient.QueryOutput) => {
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
            TableName: "booking",
            IndexName: "candidateId-category-index",
            ProjectionExpression: "bookingId,candidateId,category,dateOfExam",
            KeyConditionExpression: "#candidateId = :candidateIdFilter AND #category = :categoryFilter",
            FilterExpression: "#date < :dateFilter AND #testStatus <> :testStatusFilter",
            ExpressionAttributeNames: {
                "#candidateId": "candidateId",
                "#category": "category",
                "#date": "dateOfExam",
                "#testStatus": "testStatus"
            },
            ExpressionAttributeValues: {
                ":candidateIdFilter": params.candidate.candidateId,
                ":categoryFilter": params.category,
                ":dateFilter": 30,
                ":testStatusFilter" : "Taken"
            }
        }

        return Observable.create((observer: any) => {
                const documentClient = new DocumentClient();
                const queryCallBack$ = Observable.bindCallback(documentClient.query).bind(documentClient);
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
                        console.log("error in validateBookingForCandidate")
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
                return that.findCandidateByEmailId(inputParams.email)
            },
            function (candidate: Candidate) {
                console.log("Candidate Received" + JSON.stringify(candidate));
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
                    }
                    console.log(`calling updateCandidateInfo with ${JSON.stringify(uInput)}`);
                    return that.updateCandidateInfo(uInput)
                }
            },
            function (updatedCandidateSuccessfully: boolean) {
                if (updatedCandidateSuccessfully) {
                    console.log(`calling updateBookingInfo with ${JSON.stringify(inputParams)}`);
                    return that.updatedBookingInfo(inputParams)
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

    private doPostRegistrationTasks(inputParams: RegisterCandidateInputParams) {
        let message = {
            email: inputParams.email,
            emailSubject: inputParams.emailSubject,
            emailBody: inputParams.emailBody,
            token: inputParams.token
        }
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

    private updateBookingInElasticSearch() {
        console.log("update booking in elastic search index by pushing to stream");
    }

    private updatedBookingInfo(inputParams: RegisterCandidateInputParams): Observable<boolean> {
        return Observable.create((observer) => {
            const testStatus = "NotTaken";
            const documentClient = new DocumentClient();
            const params = {
                TableName: "booking",
                Key: {
                    bookingId: v4()
                },
                ExpressionAttributeNames: {
                    '#cid': 'candidateId',
                    '#ct': 'category',
                    '#jp': 'jobPosition',
                    "#ts": 'testStatus'
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
            documentClient.update(params, (err, data: any) => {
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
            const documentClient = new DocumentClient();
            const params = {
                TableName: "candidate",
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
            documentClient.update(params, (err, data: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log("update the TokenId in Candidate Table", result);
                resolve(true);

            });
        });
    }

    updateCandidateInfo(result: any): Observable<boolean> {
        var that = this;
        return Observable.defer(() => {
            return Observable.fromPromise(that.updateCandidateInfoPromise(result));
        })
    }

    findById(candidateId: string): Observable<Candidate> {
        console.log("in CandidateServiceImpl find()");

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "candidate",
            ProjectionExpression: "candidateId, firstName, lastName, email, phoneNumber",
            KeyConditionExpression: "#candidateId = :candidateIdFilter",
            ExpressionAttributeNames: {
                "#candidateId": "candidateId"
            },
            ExpressionAttributeValues: {
                ":candidateIdFilter": candidateId
            }
        }

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Candidate>) => {
            console.log("Executing query with parameters " + queryParams);
            documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if (data.Items.length === 0) {
                    console.log("no data received for getAll candidates");
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

        console.log("in CandidateServiceImpl getAll()");
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "candidate",
            ProjectionExpression: "candidateId, firstName, lastName, email",
        }

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Candidate>) => {
            console.log("Executing query with parameters " + queryParams);
            documentClient.scan(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if (data.Items.length === 0) {
                    console.log("no data received for getAll candidates");
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
}
