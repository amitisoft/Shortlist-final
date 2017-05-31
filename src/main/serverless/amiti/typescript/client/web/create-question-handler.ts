import { CreateQuestionFacade } from '../facade/create-question-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class CreateQuestionHandler {

    static createQuestion (httpContext: HttpContextImpl,injector: Injector): void {
        let body = httpContext.getRequestBody();
        injector.get(CreateQuestionFacade).createQuestion(body)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
        });
    }

static getQuestionByCategory(httpContext: HttpContextImpl,injector: Injector): void {

        let pathParam = httpContext.getPathParameters();
        let categoryId = pathParam['Category'];
        let lastqsnid = pathParam['LastqsnId'];
        injector.get(CreateQuestionFacade).findbyCategory(categoryId,lastqsnid)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
}


static getAllQuestionsByPaperId (httpContext: HttpContextImpl,injector: Injector): void {

       let pathParam = httpContext.getPathParameters();
       let qsnPaperId = pathParam['qsnPaperId'];
       injector.get(CreateQuestionFacade).getAllQuestionsByPaperId(qsnPaperId)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
  }
}