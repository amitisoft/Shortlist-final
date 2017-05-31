
import { ResultFacade } from '../facade/Result-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';
import { ResultSearchParams } from '../service/Result-service';

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

  static findESResultSearch(httpContext: HttpContextImpl, injector: Injector): void {
        let body = httpContext.getRequestBody() || {};
        console.log('req body', body);
        let searchParams: ResultSearchParams = {
            fullName: body.fullName,
            email: body.email,
            phoneNumber: body.phoneNumber,
            jobPosition: body.jobPosition,
            dateOfExamRange: body.dateOfExamRange,
            score: body.score,
            from: body.pageNumber || 0,
            size: 30
        };
        console.log('search params', searchParams);
        injector.get(ResultFacade).findESResultSearch(searchParams)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
