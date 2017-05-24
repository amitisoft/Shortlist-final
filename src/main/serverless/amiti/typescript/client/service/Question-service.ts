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

    getQsn(questionId: string, category: string): Observable<Question> {
        console.log('in QsnPaperServiceImpl get()');
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'question',
            ProjectionExpression: 'category,questionId, question, correctAns, option1, option2, option3, option4, multiFlag',
            KeyConditionExpression: '#category = :category and #questionId = :questionId',
            ExpressionAttributeNames: {
                '#category': 'category',
                '#questionId': 'questionId'
            },
            ExpressionAttributeValues: {
                ':category': category,
                ':questionId': questionId
            },
        };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Question>) => {
            console.log('Executing query with parameters ' + queryParams);
            documentClient.query(queryParams, (err, data: any) => {
                console.log(`did we get error ${ err }`);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${ data.Items.length }`);
                if (data.Items.length === 0) {
                    console.log('no data received for get Qsn');
                    observer.complete();
                    return;
                }
                data.Items.forEach((item) => {
                    console.log(`category ${ item.category }`);
                    console.log(`question ${ item.question }`);
                    console.log(`correctAns ${ item.correctAns }`);
                    console.log(`option1 ${ item.option1 }`);
                });
                observer.next(data.Items);
                observer.complete();

            });
        });
    }
}
