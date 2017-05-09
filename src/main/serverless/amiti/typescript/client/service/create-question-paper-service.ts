import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {DynamoDB, SES} from "aws-sdk";
import {Question} from '../domain/question';
import {UUID} from 'angular2-uuid';

const AWS = require('aws-sdk');
let uuid = UUID.UUID();


import DocumentClient = DynamoDB.DocumentClient;

AWS.config.update({
    region: "us-east-2"
});

@Injectable()
export class createQuestionPaperserviceImpl {

    constructor() {
        console.log("in createQuestionPaperserviceImpl constructor()");
    }

    createQuestionPaper(data: any): Observable<Question> {
        const documentClient = new DocumentClient();

        const qsnppr = [];
        let params: any = {};

        if (typeof data == "string") {
            data = JSON.parse(data);
            for (var item = 0; item < data.length; item++) {

                let myObj = {
                    PutRequest: {
                        Item: {
                            "Qsn_Ppr_Id": uuid,
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
                            "Qsn_Ppr_Id": uuid,
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

}