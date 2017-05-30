import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { QsnIds } from '../domain/QsnIds';
import { Question } from '../domain/Question';
import { DynamoDB } from 'aws-sdk';
import { questionsArray } from './Question-service';
const AWS = require('aws-sdk');

import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: 'us-east-1'
});

@Injectable()
export class QsnIdsServiceImpl {
 
    constructor() {
        console.log('in QsnIdsServiceImpl constructor()');
    }

        getQsnId(questionPaperId: string, endTime:string): Observable<questionsArray> { 
        console.log('in QsnIdsServiceImpl get()');
        console.log(questionPaperId);
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'questionPaper',
            ProjectionExpression: 'questionId',
            KeyConditionExpression: '#questionPaperId = :questionPaperId',
            ExpressionAttributeNames: {
                '#questionPaperId': 'questionPaperId',

            },
            ExpressionAttributeValues: {
                ':questionPaperId': questionPaperId,
            },
        };
        console.log(queryParams);
        const documentClient = new DocumentClient();
        return Observable.create((observer:Observer<questionsArray>) => {
            console.log('Executing query with parameters ' + queryParams);
            documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${err}`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if (data.Items.length === 0) {
                    console.log('no data received for get Qsn');
                    observer.complete();
                    return;
                }
                let myResult:any = {};
                myResult.QsnIds = data.Items;
                myResult.endingTime = endTime;
                console.log(data);
                observer.next(myResult);
                observer.complete();
            });

        });

    }
}