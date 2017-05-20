import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Question } from '../domain/Question';
import { DynamoDB } from 'aws-sdk';

const AWS = require('aws-sdk');

import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: 'us-east-1'
});

@Injectable()
export class QuestionServiceImpl {

    constructor() {
        console.log('in QsnPaperServiceImpl constructor()');
    }

    getQsn(qsnId: string, category: string): Observable<Question> {
        console.log('in QsnPaperServiceImpl get()');
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'question',
            ProjectionExpression: 'Category,Qsn_id, Qsn, Crct_ans, Option1,Option2, Option3, Option4,Multi_flag',
            KeyConditionExpression: '#Category = :Category and #QsnId = :QsnId',
            ExpressionAttributeNames: {
                '#Category': 'Category',
                '#QsnId': 'Qsn_id'
            },
            ExpressionAttributeValues: {
                ':Category': category,
                ':QsnId': qsnId
            },

        };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Question>) => {
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
                data.Items.forEach((item) => {
                    console.log(`Category ${item.Category}`);
                    console.log(`Qsn ${item.Qsn}`);
                    console.log(`Curct_ans ${item.curct_ans}`);
                    console.log(`Opt1 ${item.Opt1}`);
                });

                observer.next(data.Items);
                observer.complete();

            });

        });

    }
}
