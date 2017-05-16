/**
 * Created by Shyamal.Upadhyaya on 08/05/17.
 */

import {CandidateFacade} from '../facade/candidate-facade';
import {BookingFacade} from '../facade/booking-facade';
import {Injector} from '@angular/core';
import {HttpContextImpl} from "../../api/http/http-context-impl";
import {RegisterCandidateInputParams} from "../service/candidate-service";
import {LambdaContextImpl} from "../../api/lambda/lambda-context-impl";
import {StreamContextImpl} from "../../api/stream/stream-context-impl";

export class GetBookingHandler {

static isActiveLink(httpContext:HttpContextImpl,injector:Injector) : void {
        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));
        injector.get(BookingFacade).isLinkActive(pathParameters)
       .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });

         }
}