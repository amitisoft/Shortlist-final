import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DynamoDB } from 'aws-sdk';
import { Question } from '../domain/question';
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
}
