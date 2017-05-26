import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Question } from '../domain/Question';
import { QsnIds } from '../domain/QsnIds';
import { Booking } from '../domain/booking';
import { DynamoDB } from 'aws-sdk';
import { UtilHelper } from '../../api/util/util-helper';
import { QsnIdsServiceImpl } from './QsnIds-service';
import { BookingServiceImpl } from './booking-service';
const AWS = require('aws-sdk');

import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: 'us-east-1'
});

 export interface QsnParams
  {
     category:string;
     questionPaperId: string;
     questionId: string;
     bookingId:string;
     endingTime?:string;
}

  export interface sendQuestionInfo
  {
    questionId: string;
    question: string;
    category: string;
    correctAns: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    endingTime: string;
    total_No_of_Qsns_Per_QsnPaperId:number;
   }

  
@Injectable()
export class QuestionServiceImpl {

    constructor(private region: string,private documentClient: DynamoDB.DocumentClient,private qsnIdsServiceImpl:QsnIdsServiceImpl,private bookingServiceImpl:BookingServiceImpl){
        console.log('in QsnPaperServiceImpl constructor()');
    }
    getNextQuestion(params:QsnParams) :Observable<Question>
    {
         let that=this;
         let results : any={};
         let bookingSlotTimings : any ={};
          return Observable.create((observer:Observer<Question>) => {
               const registrationWaterFall = UtilHelper.waterfall([
                   function () {
                    return   that.qsnIdsServiceImpl.getQsnId(params['questionPaperId']);
                     },
                     function(questionPaperData:QsnIds[]) {
                         console.log("function2",questionPaperData);
                         let total_No_of_Qsns_Per_QsnPaperId=questionPaperData.length;
                         results.count=total_No_of_Qsns_Per_QsnPaperId;
                         console.log(results.count);
                         results.questionArray=questionPaperData;
                         return that.bookingServiceImpl.getFinsihExamTimeByBookingId(params['bookingId']);
                     },
                   function (bookingSlotTime:Booking) {
                         console.log("endtime-->",bookingSlotTime.endingTime,"starttime-->",bookingSlotTime.endingTime);
                         results.endingTime = bookingSlotTime.endingTime;
                         results.startingTime = bookingSlotTime.startingTime;
                     return that.getQsn(results.questionArray[params['currentQsnNo']].questionId,params['category'],results.count,results.endingTime,params['currentQsnNo']);
                 }
                 ]);
         registrationWaterFall.subscribe(
                 function (x) {
                 let temp = JSON.parse(JSON.stringify(x));
                 console.log(x);
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

     getQsn(questionId: string, category: string,total_No_of_Qsns:number,endingTime:string,currentQsno:string): Observable<Question> {
        console.log('in QsnPaperServiceImpl get()');
        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'question',
            ProjectionExpression: 'category,questionId,question,correctAns,option1,option2,option3,option4,multiFlag',
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
                console.log(data.Items[0]);
                if (data.Items.length === 0) {
                    console.log('no data received for get Qsn');
                    observer.complete();
                    return;
                }
                // data.Items.forEach((item) => {
                //     console.log(`category ${ item.category }`);
                //     console.log(`question ${ item.question }`);
                //     console.log(`correctAns ${ item.correctAns }`);
                //     console.log(`option1 ${ item.option1 }`);
                // });
                console.log(JSON.stringify(data.Items[0].correctAns));

                  let qusn: any = {};
                  qusn.category=data.Items[0].category;
                  qusn.correctAns=new Buffer(JSON.stringify(data.Items[0].correctAns)).toString('base64');
                  qusn.question=data.Items[0].question;
                  qusn.option1=data.Items[0].option1;
                  qusn.option2=data.Items[0].option2;
                  qusn.option3=data.Items[0].option3;
                  qusn.option4=data.Items[0].option4;
                  qusn.total_No_of_Qsns_Per_QsnPaperId=total_No_of_Qsns;
                  qusn.endTime=endingTime;
                  qusn.questionNo=questionId.indexOf(questionId)+1;  //parseInt(currentQsno)+1; 
                  observer.next(qusn);                  
                //observer.next(data.Items);
                observer.complete();
            });
        });
    }

      getQuestion(questionId: string, category: string): Observable<Question> {
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
