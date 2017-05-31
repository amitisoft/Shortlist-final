import { SES, AWSError } from 'aws-sdk';
import { Callback, Context } from 'aws-lambda';
import 'rxjs/add/observable/bindNodeCallback';
import { LambdaHandler } from '../../api/http/http-context-impl';
import { NotificationMessage } from './candidate-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const entitie = require('html-entities').AllHtmlEntities;
const entities = new entitie();
const path = require('path');
const fs = require('fs');
const emailConfig = {
    region: 'us-east-1'
};

@Injectable()
export class NotificationServiceImpl {

    constructor(private candidatehomepageurl: string) {

    }

    sendRegistrationEmail(message: NotificationMessage, bookingId: any): Observable<string> {
         console.log('message.....', message);
        let that = this;

        const emailSES = new SES(emailConfig);

        const emailPromise = new Promise((res, rej) => {

            if (!message.email || !message.emailBody) {
                rej('Please provide email and message');
                return;
            }
    const emailParams: AWS.SES.SendEmailRequest = this.createEmailParamConfig(message.email, message.emailBody, message.token, bookingId, message.emailTemplate, message.category, message.jobPosition);
            emailSES.sendEmail(emailParams, (err: any, data: AWS.SES.SendEmailResponse) => {
                if (err) {
                    rej(`Error in sending out email ${err}`);
                    return;
                }

                res(`Successfully sent email to ${message.email}`);

            });
        });

        return Observable.defer(() => {
            return Observable.fromPromise(emailPromise);
        });

    }

    private createEmailParamConfig(email: string, message: string, token: string, bookingId: any, emailTemplate: string, category: string, jobPosition: string ): AWS.SES.SendEmailRequest {
        console.log('createEmailParamConfig....', message);
        const params = {
            Destination: {
                BccAddresses: [],
                CcAddresses: [],
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                        Data: this.generateEmailTemplate(email, message, token, bookingId, emailTemplate, category, jobPosition),
                        Charset: 'UTF-8'
                    }
                },
                Subject: {
                    Data: 'Testing Email',
                    Charset: 'UTF-8'
                }
            },
            Source: 'kiran.a@amitisoft.com',
            ReplyToAddresses: ['kiran.a@amitisoft.com'],
            ReturnPath: 'kiran.a@amitisoft.com'
        };
        return params;
    }


    private generateEmailTemplate(emailFrom: string, message: string, token: string , bookingId: any , emailTemplate: string , category: string , jobPosition: string): any {
        console.log('generateEmailTemplate....', emailTemplate);
      console.log(typeof emailTemplate);

let obj = {
'bookingId': bookingId,
'tokenId': token
};


let linkId = new Buffer(JSON.stringify(obj)).toString('base64');

let temp = entities.decode(emailTemplate);


console.log('this.candidatehomepageurl.....',this.candidatehomepageurl);
let mapObj = {
   'EmailFrom': emailFrom,
   'TokenID': this.candidatehomepageurl + linkId,
   'MailBody': message,
   'Categorys': category,
   'Posts': jobPosition

};
 temp = temp.replace(/EmailFrom|TokenID|MailBody|Categorys|Posts/gi, function(matched){
   return mapObj[matched];
 });


return temp;
//         return `
//          <!DOCTYPE html>
//          <html>
//            <head>
//              <meta charset='UTF-8' />
//              <title>title</title>
//            </head>
//            <body>
//             <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>
//              <tr>
//                  <td align='center' valign='top'>
//                      <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>
//                          <tr style='background-color:#99ccff;'>
//                              <td align='center' valign='top'>
//                                  <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailBody'>
//                                      <tr>
//                                          <td align='center' valign='top' style='color:#337ab7;'>
//                                              <h3><a href="http://mail.amiti.in/verify.html?token=${linkId}">http://mail.amiti.in/verify.html?token=${linkId}</a>
//                                              </h3>
//                                          </td>
//                                      </tr>
//                                  </table>
//                              </td>
//                          </tr>
//                          <tr style='background-color:#74a9d8;'>
//                              <td align='center' valign='top'>
//                                  <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailReply'>
//                                      <tr style='font-size: 1.2rem'>
//                                          <td align='center' valign='top'>
//                                              <span style='color:#286090; font-weight:bold;'>Send From:</span> <br/> ${emailFrom}
//                                          </td>
//                                      </tr>
//                                  </table>
//                              </td>
//                          </tr>
//                      </table>
//                  </td>
//              </tr>
//              </table>
//            </body>
//          </html>
// `;
    }

}
