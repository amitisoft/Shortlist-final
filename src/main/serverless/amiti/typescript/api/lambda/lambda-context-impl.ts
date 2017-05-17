import { Callback, Context } from 'aws-lambda';

export interface CustomLambdaEvent {
    data: any;
}

export class LambdaContextImpl {

    constructor(private lambdaEvent: CustomLambdaEvent, private lambdaContext: Context, private lambdaCallback: Callback) {

    }

    ok(response: any) {
        this.lambdaCallback(null, response);
    }

    fail(error: any, response?: any) {
        this.lambdaCallback(error, response);
    }

    getEventData(): any {
        if (typeof this.lambdaEvent.data === 'string') {
            this.lambdaEvent.data = JSON.parse(this.lambdaEvent.data);
        }
        return this.lambdaEvent.data;

    }

    getRequestContext(): any {
        return this.lambdaContext;
    }
}
