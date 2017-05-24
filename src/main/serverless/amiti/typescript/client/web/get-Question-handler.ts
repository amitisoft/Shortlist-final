import { QuestionFacade } from '../facade/Question-facade';
import { QsnIdsFacade } from '../facade/QsnIds-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class GetQsnHandler {

    static getQsn(httpContext: HttpContextImpl, injector: Injector): void {


        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        injector.get(QsnIdsFacade).getQsnId(pathParameters['questionPaperId'])
            .subscribe(result => {

                // httpContext.ok(200, result);
                console.log(`result= ${result[1].questionId}`);
                console.log(`result= ${result[pathParameters['questionNo']].questionId}`);
               // injector.get(QuestionFacade).getQsn(result[data["QsnNo"]].QsnId, data["Category"])
                injector.get(QuestionFacade).getQsn(result[pathParameters['questionNo']].questionId, pathParameters['category'])
                    .subscribe(result1 => {
                        console.log(`Qsn = ${result1}`);
                        httpContext.ok(200, result1);

                    });
            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
