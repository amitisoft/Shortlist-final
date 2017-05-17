import { ResultFacade } from '../facade/Result-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class UpdateResultHandler {

    static updateResult(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        let data = httpContext.getRequestBody();
        console.log(`data = , ${data}`);
        injector.get(ResultFacade).update(data)
            .subscribe(result => {
                httpContext.ok(200, result);

            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
