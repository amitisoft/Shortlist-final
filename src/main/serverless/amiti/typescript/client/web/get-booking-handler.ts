import { BookingFacade } from '../facade/booking-facade';
import { Injector } from '@angular/core';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';
import { HttpContextImpl } from "../../api/http/http-context-impl";

export class GetBookingHandler {


   
    static performElasticSearchUpdate(streamContext: DBStreamContextImpl, injector: Injector): void {
        injector.get(BookingFacade).updateBookingInElasticSearch(streamContext.getRecord())
            .subscribe(result => {
                console.log(`result ${result}`);
                streamContext.ok();
            }, err => {
                streamContext.fail(err);
            });
    }

    static isTestLinkStatusInfo(httpContext: HttpContextImpl, injector: Injector): void {
         let pathParameters = httpContext.getPathParameters();
         console.log(JSON.stringify(pathParameters));
         injector.get(BookingFacade).isTestLinkStatusInfo(pathParameters)
             .subscribe(result => {
                 httpContext.ok(200, result);
             }, err => {
                 httpContext.fail(err, 500);
             });
     }


      static updateExamTimingSlots(httpContext: HttpContextImpl, injector: Injector): void {
         let body = httpContext.getRequestBody();
         console.log(JSON.stringify(body));
         injector.get(BookingFacade).updateExamTimingSlots(body)
             .subscribe(result => {
                 httpContext.ok(200, result);
             }, err => {
                 httpContext.fail(err, 500);
             });
     }
}

