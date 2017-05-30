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


 export interface reqParams
  {
     category:string;
     questionPaperId: string;
     currentQsnNo: string;
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

export interface timeSlot
{
    startingTime: string;
    endingTime:string;
}
export interface  questionsArray
{
   QsnIds?: string[];
   endingTime?:string;
   message?:string;
}
  
@Injectable()
export class QuestionServiceImpl {

    constructor(private region: string,private documentClient: DynamoDB.DocumentClient,
    private qsnIdsServiceImpl:QsnIdsServiceImpl,private bookingServiceImpl:BookingServiceImpl){
    console.log('in QsnPaperServiceImpl constructor()');
    }
    getNextQuestion(params:reqParams) :Observable<Question>
    {
         let that=this;
               return Observable.create((observer:Observer<Question>) => {
               const registrationWaterFall = UtilHelper.waterfall([
                   function()
                   {  
                      return that.bookingServiceImpl.getExamTimingsByBookingId(params['bookingId']);
                   },
               function (bookingSlotTime:timeSlot) { 
                console.log("endtime-->",bookingSlotTime.endingTime,"starttime-->",bookingSlotTime.startingTime);
                 let stime= new Date().getTime();
                                     if( stime > parseInt(bookingSlotTime.endingTime) )
                                     {
                                    return that.qsnIdsServiceImpl.getQsnId(params['questionPaperId'], bookingSlotTime.endingTime);
                                     }
                                     else
                                     {
                                       return that.bookingServiceImpl.updateTestStausAfterCompleteExam(params['bookingId']);
                                     }      
                     },
                      function(questionPaperData:questionsArray) {
                          if(questionPaperData.message){
                              return Observable.create((observer: Observer<string>)=>{
                                observer.next(questionPaperData.message);
                                observer.complete();
                              });
                          }
                          console.log(questionPaperData);
                          let timeZoneOffset=new Date().getTimezoneOffset();
                          let bros_etime=new Date(parseInt(questionPaperData.endingTime)-timeZoneOffset).getTime();
                          let total_No_of_Qsns_Per_QsnPaperId=questionPaperData.QsnIds.length;
                         console.log(params['currentQsnNo']);
                         console.log(questionPaperData.QsnIds[params['currentQsnNo']].questionId);
                     return that.getQsn(questionPaperData.QsnIds[params['currentQsnNo']].questionId,params['category'],total_No_of_Qsns_Per_QsnPaperId,bros_etime.toString(),params['currentQsnNo']);
                     },
                   ]);
         registrationWaterFall.subscribe(
                 function (x) {
                 let temp = JSON.parse(JSON.stringify(x));
                console.log("Booking values = ",JSON.stringify(x));
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
        console.log(`Question ID: ${questionId}`);
        console.log(` Total No of Qns ${total_No_of_Qsns}`);
        console.log(`Category ${category}`);
        console.log(`endTime${endingTime}`);
        console.log(`currentQsno${currentQsno}`);
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
                  qusn.questionNo=parseInt(currentQsno)+1; 
                  qusn.questionId=questionId;
                  observer.next(qusn);                  
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
