import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {DynamoDB, SES} from "aws-sdk";
import {Question} from '../domain/question';
import {UUID} from 'angular2-uuid';

const AWS = require('aws-sdk');
let uuid = require('uuid');

import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: " us-east-1"
});

@Injectable()
export class createQuestionPaperserviceImpl {

    constructor() {
        console.log("in createQuestionPaperserviceImpl constructor()");
    }

    createQuestionPaper(data: any,qsnPaperName:any): Observable<Question> {
        const documentClient = new DocumentClient();


console.log("qsnPaperName[[[[[[[[[[[[[[[",qsnPaperName);

        const qsnppr = [];
        let params: any = {};
        let uuidd = uuid.v4();
         const qsnpapernames = {
            TableName: "questionPaperNames",
            Item: {
                QsnPaper_id: uuidd,
                Qsn_Paper_name:qsnPaperName,
            }

        };


        if (typeof data == "string") {
            data = JSON.parse(data);
            for (var item = 0; item < data.length; item++) {

                let myObj = {
                    PutRequest: {
                        Item: {
                            "Qsn_Ppr_Id": uuidd,
                            "Qsn_Id": data[item].QsnId,
                            "Category": data[item].Category
                        }
                    }
                }
                qsnppr.push(myObj)
            }

            params = {
                RequestItems: {
                    "questionPaper": qsnppr
                }
            };

        } else {

            for (var item = 0; item < data.length; item++) {
                let myObj = {
                    PutRequest: {
                        Item: {
                            "Qsn_Ppr_Id": uuidd,
                            "QsnId": data[item].QsnId,
                            "Category": data[item].Category
                        }
                    }
                }
                qsnppr.push(myObj)
            }

            params = {
                RequestItems: {
                    "questionPaper": qsnppr
                }
            };

        }

        return Observable.create((observer: Observer<Question>) => {
             
             documentClient.put(qsnpapernames, (err, data: any) => {
                console.log("ddddddddddddddddd",data);
                console.log("eeeeeeeeeeeeee",err);
                if(err) {
                        observer.error(err);
                        return;
                }
                
                data = "success";
               // console.log(data.Item[0]);
                observer.next(data);
               // observer.complete();
            });

            documentClient.batchWrite(params, (err, data: any) => {

                if (err) {

                    observer.error(err);
                    return;
                }
                data = "success";
                // console.log(data.Item[0]);
                observer.next(data);
                observer.complete();
            });
        });

    }

getAllQuestionPaperNames(): Observable<Question[]> {
        console.log("in getAllQuestionPaperNames find()");

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "questionPaperNames",
            ProjectionExpression: "Qsn_Paper_name,QsnPaper_id",
        }

        const documentClient = new DocumentClient();
        return Observable.create((observer:Observer<Question>) => {
            documentClient.scan(queryParams,(err,data:any) => {
                console.log(`did we get error ${err}`);
                if(err) {
                    observer.error(err);
                    throw err;
                }
                console.log("data...",data);
                if(data.Items.length === 0) {
                    console.log("no data received for this category");
                    observer.complete();
                    return;
                }
            
                 data.Items.forEach((item) => {
                    //console.log(`candidate Id ${item.Qsn_Paper_name}`);
                    //console.log(`candidate firstName ${item.QsnPaper_id}`);
                });
                console.log(data.Items);
                observer.next(data.Items);
                observer.complete();

            });
        });

    }

}