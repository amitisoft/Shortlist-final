import { BookingFacade } from '../facade/booking-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';

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

    static isActiveLink(httpContext: HttpContextImpl, injector: Injector): void {
        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));
        injector.get(BookingFacade).isLinkActive(pathParameters)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });

    }
}
