import { BookingFacade } from '../facade/booking-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class GetBookingHandler {

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
