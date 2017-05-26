import { CandidateFacade } from '../facade/candidate-facade';
import { BookingFacade } from '../facade/booking-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';
import { RegisterCandidateInputParams } from '../service/candidate-service';
import { LambdaContextImpl } from '../../api/lambda/lambda-context-impl';
import { StreamContextImpl } from '../../api/stream/stream-context-impl';
import { DBStreamContextImpl } from '../../api/stream/stream-context-impl';
import { CandidateSearchParams } from '../service/candidate-service';

export class GetCandidateHandler {

    static processRegistrationStream(streamContext: StreamContextImpl, injector: Injector): void {
        console.log(`record in processRegistrationStream: ${JSON.stringify(streamContext.getRecord())}`);
        console.log(`partition key in processRegistrationStream: ${JSON.stringify(streamContext.getRecord().getPartitionKey())}`);
        console.log(`payload in processRegistrationStream: ${JSON.stringify(streamContext.getRecord().getPayload())}`);
        if(streamContext.getRecord().getPayload() !== null)
        {
            injector.get(CandidateFacade).registerCandidate(streamContext.getRecord().getPayload());
        }

    }

    static registerCandidatesAndEmailPostRegistration(httpContext: HttpContextImpl, injector: Injector): void {
        let requestBody = httpContext.getRequestBody();
        console.log(`request body received ${JSON.stringify(requestBody)}`)
        console.log(`input in register candidate ${JSON.stringify(requestBody)}`);
        injector.get(CandidateFacade).registerCandidatesAndEmailPostRegistration(requestBody)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });

    }


    static registerCandidate(httpContext: HttpContextImpl, injector: Injector): void {
        let requestBody = httpContext.getRequestBody();
        console.log(`request body received ${JSON.stringify(requestBody)}`)
        console.log(`input in register candidate ${JSON.stringify(requestBody)}`);
        injector.get(CandidateFacade).registerCandidate(requestBody);
    }
    static findCandidateById(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        let candidateId = pathParameters.id;

        injector.get(CandidateFacade).findbyId(candidateId)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });

        // injector.get(CandidateFacade).findbyId(candidateId)
        //     .subscribe(result => {
        //         injector.get(CandidateFacade).findbyEmail(candidateId)
        //             .subscribe(result => {
        //                 httpContext.ok(200, result);
        //             });
        //     },  err => {
        //         httpContext.fail(err, 500);
        //     });
    }


    static startTestDashboard(httpContext:HttpContextImpl,injector:Injector) : void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        injector.get(BookingFacade).getWhoNotTakenTest(pathParameters)
            .subscribe(result => {
                console.log('myresult = ',result);
                injector.get(BookingFacade).getAllCandidateInfoWhoNotTakenTest(result)      //getAllBookings
                    .subscribe(result1 => {
                        console.log('myresult = ',result1);
                        httpContext.ok(200, result1);
                    });
                //  httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
    }

        static startTestInProgressDashboard(httpContext:HttpContextImpl,injector:Injector) : void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        injector.get(BookingFacade).getTestInProgressBooking()
            .subscribe(result => {
                console.log('myresult = ', result);
                injector.get(BookingFacade).getAllCandidateInfoWhoAreTestProgress(result)
                    .subscribe(result1 => {
                        console.log('myresult = ', result1);
                        httpContext.ok(200, result1);
                    });
                //  httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
    }


    static getCandidateHomePageInfo(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        injector.get(BookingFacade).getCandidateHomePageInfo(pathParameters)
            .subscribe(result => {
                    console.log('myresult = ', result);
                    injector.get(BookingFacade).candidateTokenChecking(result, pathParameters)
                        .subscribe(result1 => {
                            console.log('myresult = ', result1);
                            httpContext.ok(200, result1);
                        });
                },
                err => {
                    httpContext.fail(err, 500);
                });
    }

    static updateBookingAfterStartTest(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        let data = httpContext.getRequestBody();
        console.log('pathParameters = ', data);
        injector.get(BookingFacade).updateBookingAfterStartTest(data)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
    }

    static getCandidatesListFile(httpContext: HttpContextImpl, injector: Injector): void {

        let pathParameters = httpContext.getPathParameters();
        console.log(JSON.stringify(pathParameters));

        let data = httpContext.getRequestBody();
        console.log('pathParameters = ', data);
        injector.get(BookingFacade).getCandidatesListFile(data)
        .subscribe(result => {
                                                httpContext.ok(200, result);
                        }, err => {
                                        httpContext.fail(err, 500);
                    });
            }

    static insertCandidate(httpContext: HttpContextImpl, injector: Injector): void {

        // let pathParameters = httpContext.getPathParameters();
        // console.log(JSON.stringify(pathParameters));

        let data = httpContext.getRequestBody();
        console.log('pathParameters = ', data);
        injector.get(CandidateFacade).insertCandidate(data)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
    }

 static getAllCandidates(httpContext: HttpContextImpl, injector: Injector): void {
        injector.get(CandidateFacade).getAll()
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }

 static getCandidateInfoForView(httpContext: HttpContextImpl, injector: Injector): void {
     let data = httpContext.getPathParameters();
        console.log('pathParameters = ', data);
        injector.get(CandidateFacade).getCandidateInfoForView(data)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }
    static updateCandidateTOElasticSearch(streamContext: DBStreamContextImpl, injector: Injector): void {
        injector.get(CandidateFacade).updateCandidateTOElasticSearch(streamContext.getRecord())
            .subscribe(result => {
                console.log(`result ${result}`);
                streamContext.ok();
            }, err => {
                streamContext.fail(err);
            });
    }

     static findESCandidateSearchResult(httpContext: HttpContextImpl, injector: Injector): void {
        let body = httpContext.getRequestBody() || { pageNumber: 0};
        console.log('body =======', body);
        let searchParams: CandidateSearchParams = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phoneNumber: body.phoneNumber,
            from: body.pageNumber || 0,
            size: 30
        };
        console.log('search parameter', searchParams);
        injector.get(CandidateFacade).findESCandidateSearchResult(searchParams)
            .subscribe(result => {
                httpContext.ok(200, result);
            }, err => {
                httpContext.fail(err, 500);
            });
    }
}
