import { CandidateFacade } from '../facade/candidate-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { BookingFacade } from '../facade/booking-facade';
// import { UtilHelper } from '../../api/util/util-helper';
export class TestLinkHandler {


    static findCandidateByEmailId(httpContext: HttpContextImpl, injector: Injector): void {
        let data = httpContext.getRequestBody();
        // const findCandidateResult = UtilHelper.waterfall([
        //     function () {
        //         return injector.get(CandidateFacade).findCandidateByEmailId(data);
        //     },
        //     function (candidate) {
        //         return injector.get(BookingFacade).findByCandidateId(candidate.candidateId, data);
        //     }
        // ]);
        //
        // findCandidateResult.subscribe(
        //     function (x) {
        //         console.log(`findCandidateResult result ${JSON.stringify(x)}`);
        //         httpContext.ok(200, x);
        //     },
        //     function (err) {
        //         console.log(`findCandidateResult failed ${err.stack}`);
        //         httpContext.fail(err, 500);
        //     }
        // );

        injector.get(CandidateFacade).findCandidateByEmailId(data)
            .subscribe(result => {
                injector.get(BookingFacade).findByCandidateId(JSON.parse(JSON.stringify(result)).candidateId, data)
                    .subscribe(result1 => {
                        httpContext.ok(200, result1);
                    }, err => {
                        httpContext.fail(err, 500);
                    });
            });
    }
}



