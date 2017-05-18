import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {DynamoDB, SES} from "aws-sdk";
import {Question} from '../domain/question';
import { UUID } from 'angular2-uuid';

const AWS = require('aws-sdk');
let uuid = require('uuid');
import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: "us-east-1"
});

@Injectable()
export class CreateQuestionServiceImpl {

  constructor() {
        console.log("in CreateQuestionServiceImpl constructor()");
    }

    create(data: any): Observable<Question> {
        console.log("in CreateQuestionServiceImpl create()",typeof data);
        const documentClient = new DocumentClient();
let params: any = {};
let uuidd = uuid.v4(); 
  if(typeof data == "string"){

      data = JSON.parse(data);
     params = {
            TableName: "question",
            Item: {
                Qsn_id: uuidd,
                Qsn:data["Qsn"],
                Category: data["Category"],
                Option1:data["Option1"],
                Option2:data["Option2"],
                Option3:data["Option3"],
                Option4:data["Option4"],
                Crct_ans:data["Crct_ans"],
                Multi_flag:true
            }

        };
  }else{

   params = {
            TableName: "question",
            Item: {
                Qsn_id: uuidd,
                Qsn:data["Qsn"],
                Category: data["Category"],
                Option1:data["Option1"],
                Option2:data["Option2"],
                Option3:data["Option3"],
                Option4:data["Option4"],
                Crct_ans:data["Crct_ans"],
                Multi_flag:true
            }

        };
        
  }
console.log("parammmmmmmmmmmmmmmmmmmm00000000000000------------",data["Qsn"]);
        return Observable.create((observer:Observer<Question>) => {
             console.log("param------------",params);
            documentClient.put(params, (err, data: any) => {
                console.log("eeeeeeeeeeeeee",err);
                if(err) {
                    console.log("ifffffffffffffffffffffff");
                    if(err.code === 'ConditionalCheckFailedException'){
                        observer.error(err);
                        return;
                    }
                }
                
                data = "success";
               // console.log(data.Item[0]);
                observer.next(data);
                observer.complete();
            });
        });

    }

    findById(categoryId:string,lastqsnid:string): Observable<Question[]> {
        console.log("in CreateQuestionServiceImpl find()");

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "question",
            ProjectionExpression: "Category, Qsn_id, Qsn",
            KeyConditionExpression: "#Category = :categoryIdFilter",
            ExpressionAttributeNames:{
                "#Category": "Category"
            },
            ExpressionAttributeValues: {
                ":categoryIdFilter": categoryId
            },
            Limit:2
        }

console.log(lastqsnid)     
     if (lastqsnid != "null"){
        console.log("-----------------------------with data-----------------------");
        console.log(" data-------------",lastqsnid);
        queryParams.ExclusiveStartKey= { Qsn_id: lastqsnid,Category:categoryId}
          } else {
          console.log("----------------------------without data----------------------");
        }



        const documentClient = new DocumentClient();
        return Observable.create((observer:Observer<Question[]>) => {
            console.log("Executing query with parameters " + queryParams);
            documentClient.query(queryParams,(err,data:any) => {
                console.log(`did we get error ${err}`);
                if(err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if(data.Items.length === 0) {
                    console.log("no data received for this category");
                    observer.complete();
                    return;
                }
                // console.log("lllllllllllllll",data);
                data.Items.forEach((item) => {
                    console.log("candidate Id item",item);
                    // console.log(`candidate firstName ${item.firstName}`);
                    // console.log(`candidate lastName ${item.lastName}`);
                    // console.log(`candidate email ${item.email}`);
                });
                //console.log(data.Items);
                observer.next(data.Items);
                observer.complete();

            });
        });

    }


}