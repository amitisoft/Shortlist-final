
import { ResultFacade } from '../facade/Result-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';

export class UpdateResultHandler {

    static updateResult (httpContext:HttpContextImpl,injector:Injector) : void {
       let data = httpContext.getRequestBody();
        console.log("data = ",data);
        injector.get(ResultFacade).update(data)
            .subscribe(result => {
                httpContext.ok(200, result);
               },  err => {

                httpContext.fail(err, 500);
        });
    }

 static updateResultTOElasticSearch(streamContext: DBStreamContextImpl, injector: Injector): void {
     console.log('in updateresult handler');
        injector.get(ResultFacade).updateResultTOElasticSearch(streamContext.getRecord())
            .subscribe(result => {
                console.log(`result ${result}`);
                streamContext.ok();
            }, err => {
                streamContext.fail(err);
            });
    }

}
