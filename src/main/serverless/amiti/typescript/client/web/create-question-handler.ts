import { CreateQuestionFacade } from '../facade/create-question-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class CreateQuestionHandler {

    static createQuestion(httpContext: HttpContextImpl, injector: Injector): void {
        console.log('CreateQuestionHandler');
        let body = httpContext.getRequestBody();
        console.log('pathParameters-----', body);
        injector.get(CreateQuestionFacade).createQuestion(body)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

    static getQuestionByCategory(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParam = httpContext.getPathParameters();

        console.log('pathParameters-----??????????', pathParam);

        let categoryId = pathParam['Category'];
        let lastqsnid = pathParam['LastqsnId'];
        console.log('lastqsnid......', lastqsnid);
        injector.get(CreateQuestionFacade).findbyCategory(categoryId, lastqsnid)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
