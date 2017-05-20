import {CreateQuestionPaperFacade} from '../facade/create-question-paper-facade';
import {Injector} from '@angular/core';
import {HttpContextImpl} from '../../api/http/http-context-impl';

export class QuestionPaperHandler {

    static createQuestionPaper(httpContext: HttpContextImpl, injector: Injector): void {
        console.log("CreateQuestionHandler");
        let body = httpContext.getRequestBody();

        injector.get(CreateQuestionPaperFacade).createQuestionPaper(body)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

}