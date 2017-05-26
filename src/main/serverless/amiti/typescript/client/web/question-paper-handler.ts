import { CreateQuestionPaperFacade } from '../facade/create-question-paper-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class QuestionPaperHandler {

    static createQuestionPaper(httpContext: HttpContextImpl, injector: Injector): void {
        console.log('CreateQuestionHandler');
        let body = httpContext.getRequestBody();
        let qsns = body.qsns;
        let qsnPaperName = body.papername;
        injector.get(CreateQuestionPaperFacade).createQuestionPaper(qsns,qsnPaperName)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

    static getQuestionPaperNames(httpContext: HttpContextImpl, injector: Injector): void {
        console.log('CreateQuestionHandler');
        injector.get(CreateQuestionPaperFacade).getQuestionPapers()
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

     static getQuestionPaperNamesByCategory(httpContext: HttpContextImpl, injector: Injector): void {
        console.log('getQuestionPaperNamesByCategory');
        let pathParameters = httpContext.getPathParameters();
        let data = httpContext.getRequestBody();
        console.log(`category = ${pathParameters}`);
        injector.get(CreateQuestionPaperFacade).getQuestionPapersId(pathParameters['category'])
            .subscribe(result => {
                //  httpContext.ok(200, result);
                injector.get(CreateQuestionPaperFacade).getQuestionPaperNamesByCategory(result)
                    .subscribe(result1 => {
                        console.log(`Qsn = ${result1}`);
                        httpContext.ok(200, result1);

                    });
            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
