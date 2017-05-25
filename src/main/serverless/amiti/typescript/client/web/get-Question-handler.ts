import { QuestionFacade } from '../facade/Question-facade';
import { QsnIdsFacade } from '../facade/QsnIds-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class GetQsnHandler {

    // static getQuestion(httpContext: HttpContextImpl, injector: Injector): void {
    //     let pathParameters = httpContext.getPathParameters();
    //     console.log(JSON.stringify(pathParameters));
    //     injector.get(QsnIdsFacade).getQsnId(pathParameters['questionPaperId'])
    //         .subscribe(result => {
    //            //  httpContext.ok(200, result);
    //             console.log(`result= ${result[0].questionId}`);
    //             let total_no_of_questions=result.length;
    //             console.log("total_no_of_questions",total_no_of_questions);
    //            // console.log(`result= ${result[pathParameters['currentQsnNo']].questionId}`);
    //            // injector.get(QuestionFacade).getQsn(result[data["QsnNo"]].QsnId, data["Category"])
    //             injector.get(QuestionFacade).getQsn(result[pathParameters['currentQsnNo']].questionId, pathParameters['category'],total_no_of_questions,pathParameters['bookingId'])
    //                 .subscribe(result1 => {
    //                     console.log(`Qsn = ${result1}`);
    //                     httpContext.ok(200, result1);

    //                 });
    //         }, err => {
    //             httpContext.fail(err, 500);
    //         });
    // }

     static getQuestion(httpContext: HttpContextImpl, injector: Injector): void {
         let pathParameters = httpContext.getPathParameters();
         console.log(JSON.stringify(pathParameters));
          injector.get(QuestionFacade).getNextQuestion(pathParameters)
             .subscribe(result => {
                         httpContext.ok(200, result);
                                  }, err => {
                 httpContext.fail(err, 500);
             });
     }
}
