import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DynamoDB } from 'aws-sdk';
import { Question } from '../domain/question';
import { QuestionPaper } from '../domain/questionPaper';
import { v4 } from 'node-uuid';
const AWS = require('aws-sdk');
import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: 'us-east-1'
});

@Injectable()
export class CreateQuestionPaperserviceImpl {

    constructor() {
        console.log('in createQuestionPaperserviceImpl constructor()');
    }

    createQuestionPaper(data: any, qsnPaperName: any): Observable<Question> {
        const documentClient = new DocumentClient();


        console.log('qsnPaperName[[[[[[[[[[[[[[[', qsnPaperName);

        const qsnppr = [];
        let params: any = {};
        let uuid = v4();
        const qsnPaperNames = {
            TableName: 'questionPaperNames',
            Item: {
                QsnPaper_id: uuid,
                Qsn_Paper_name: qsnPaperName,
            }

        };


        if (typeof data === 'string') {
            data = JSON.parse(data);
            for (let item = 0; item < data.length; item++) {

                let myObj = {
                    PutRequest: {
                        Item: {
                            'questionPaperId': uuid,
                            'Qsn_Id': data[item].questionId,
                            'Category': data[item].Category
                        }
                    }
                };
                qsnppr.push(myObj);
            }

            params = {
                RequestItems: {
                    'questionPaper': qsnppr
                }
            };

        } else {

            for (let item = 0; item < data.length; item++) {
                let myObj = {
                    PutRequest: {
                        Item: {
                            'questionPaperId': uuid,
                            'QsnId': data[item].questionId,
                            'Category': data[item].Category
                        }
                    }
                };
                qsnppr.push(myObj);
            }

            params = {
                RequestItems: {
                    'questionPaper': qsnppr
                }
            };

        }

        return Observable.create((observer: Observer<Question>) => {

            documentClient.put(qsnPaperNames, (err, result: any) => {
                if (err) {
                    observer.error(err);
                    return;
                }

                data = 'success';
                observer.next(result);
                // observer.complete();
            });

            documentClient.batchWrite(params, (err, result: any) => {

                if (err) {

                    observer.error(err);
                    return;
                }
                result = 'success';
                observer.next(result);
                observer.complete();
            });
        });

    }

    getAllQuestionPaperNames(): Observable<Question[]> {
        console.log('in getAllQuestionPaperNames find()');

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'questionPaperNames',
            ProjectionExpression: 'Qsn_Paper_name,QsnPaper_id',
        };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Question>) => {
            documentClient.scan(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log('data...', data);
                if (data.Items.length === 0) {
                    console.log('no data received for this category');
                    observer.complete();
                    return;
                }

                // data.Items.forEach((item) => {
                //     //console.log(`candidate Id ${item.Qsn_Paper_name}`);
                //     //console.log(`candidate firstName ${item.QsnPaper_id}`);
                // });
                // console.log(data.Items);
                observer.next(data.Items);
                observer.complete();

            });
        });

    }

     getQuestionPaperId(category: string): Observable<QuestionPaper[]> {
        console.log('in getQuestionPaperId');

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'questionPaper',
            IndexName: 'categoryIndex',
            ProjectionExpression: 'questionPaperId',
            KeyConditionExpression: '#category = :category',
            ExpressionAttributeNames: {
                '#category': 'category'
            },
            ExpressionAttributeValues: {
                ':category': category
            },
        };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<QuestionPaper>) => {
            documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log('data...', data);
                if (data.Items.length === 0) {
                    console.log('no data received for this category');
                    observer.complete();
                    return;
                }
                observer.next(data.Items);
                observer.complete();

            });
        });

    }

    getPaperNamesByCategory(qsnId: any): Observable<QuestionPaper[]> {
        console.log('in getPaperNamesByCategory');
        let params = {
            RequestItems: {
                'questionPaperNames': {
                    Keys: qsnId,
                    ProjectionExpression: 'questionPaperName,questionPaperId'
                }
            }
        };
        // const queryParams: DynamoDB.Types.QueryInput = {
        //     TableName: 'questionPaperNames',
        //     ProjectionExpression: 'questionPaperId,questionPaperName',
        //     KeyConditionExpression: '#qsnId = :qsnId',
        //     ExpressionAttributeNames: {
        //         '#qsnId': 'qsnId'
        //     },
        //     ExpressionAttributeValues: {
        //         ':qsnId': qsnId
        //     },
        // };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<QuestionPaper>) => {
            documentClient.batchGet(params, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log('data...', data);
                if (data.Responses.length === 0) {
                    console.log('no data received for this category');
                    observer.complete();
                    return;
                }
                observer.next(data.Responses);
                observer.complete();

            });
        });

    }
}
  // getAllCandidateInfoWhoNotTakenTest(data: any): Observable<Booking[]> {
    //     let candidateKey = [];
    //     data.forEach((item) => {
    //         console.log('in side for each');
    //         let myObj = {'candidateId': ''};
    //         myObj.candidateId = item.candidateId;
    //         let checkUniq = candidateKey.find((obj) => {
    //             return obj.candidateId === myObj.candidateId;
    //         });
    //         if (!checkUniq) {
    //             candidateKey.push(myObj);
    //         }
    //     });
    //     console.log('candidate Id list = ', candidateKey);

    //     let params = {
    //         RequestItems: {
    //             'candidate': {
    //                 Keys: candidateKey,
    //                 ProjectionExpression: 'email,firstName,lastName,candidateId'
    //             }
    //         }
    //     };
    //     return Observable.create((observer: Observer<Booking>) => {
    //         this.documentClient.batchGet(params, function (err, data1) {
    //             if (err) {
    //                 observer.error(err);
    //                 throw err;
    //             } else {
    //                 let resultArray: any = [];
    //                 // console.log('booking data = ',data);
    //                 let res = (JSON.parse(JSON.stringify(data1.Responses))).candidate;
    //                 //  console.log('res = ',res);
    //                 data.forEach((item) => {
    //                     let newArray = res.filter((id) => {
    //                         return (id.candidateId === item.candidateId);
    //                     });
    //                     //  console.log('new array', newArray[0]);
    //                     //  console.log('item = ',item.candidateId);
    //                     // if (newArray != undefined){
    //                     let bookinginfo = new Booking();
    //                     bookinginfo.candidateId = item.candidateId;
    //                     bookinginfo.candidateId = item.candidateId;
    //                     bookinginfo.testStatus = item.testStatus;
    //                     bookinginfo.bookingId = item.bookingId;
    //                     bookinginfo.category = item.category;
    //                     bookinginfo.fullName = `${ newArray[0].firstName } ${ newArray[0].lastName }`;
    //                     bookinginfo.email = newArray[0].email;
    //                     bookinginfo.jobPosition = item.jobPosition;
    //                     resultArray.push(bookinginfo);
    //                     //  console.log(' result', bookinginfo);
    //                     //      }

    //                 });
    //                 observer.next(resultArray);
    //                 observer.complete();
    //             }
    //         });
    //     });
    // }
