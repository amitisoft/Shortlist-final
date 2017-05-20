import { Injector } from '@angular/core';
import { Callback, Context } from 'aws-lambda';

export class LambdaContextImpl {

    constructor(private lambdaEvent: any, private lambdaContext: Context, private lambdaCallback: Callback) {

    }

    ok(response: any) {
        this.lambdaCallback(null, response);
    }

    fail(error: any, response?: any) {
        this.lambdaCallback(error, response);
    }

    getEventData(): any {
        console.log(`lambdaEvent in LambdaContextImpl => ${JSON.stringify(this.lambdaEvent)}`);
        return this.lambdaEvent;
    }

    getRequestContext(): any {
        return this.lambdaContext;
    }
}
