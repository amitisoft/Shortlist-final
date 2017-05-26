import { BookingFacade } from '../facade/booking-facade';
import { Injector } from '@angular/core';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { BookingSearchParams } from '../service/booking-service';

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

    static getESTestNotTakenResults(httpContext: HttpContextImpl, injector: Injector): void {
        injector.get(BookingFacade).getESTestNotTakenResults()
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }


    static getESTestInProgressResults(httpContext: HttpContextImpl, injector: Injector): void {
        injector.get(BookingFacade).getESTestInProgressResults()
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

    static findESBookingSearchResult(httpContext: HttpContextImpl, injector: Injector): void {
        let body = httpContext.getRequestBody() || { pageNumber: 0};
        console.log('req body', body);
        let searchParams: BookingSearchParams = {
            testStatus: body.testStatus,
            fullName: body.fullName,
            category: body.category,
            dateOfExamRange: body.dateOfExamRange,
            paperType: body.paperType,
            email: body.email,
            from: body.pageNumber || 0,
            size: 30
        };
        console.log('search params', searchParams);
        injector.get(BookingFacade).findESBookingSearchResult(searchParams)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }


}

