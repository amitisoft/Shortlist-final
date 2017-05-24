import { Injector } from '@angular/core';
import { Callback, Context } from 'aws-lambda';


export interface LambdaHandler {
    (event: any, context: Context, callback: Callback): void;
}

export interface HttpHandler {
    (context: HttpContextImpl, injector: Injector): void;
}

export class HttpContextImpl {

    constructor(private lambdaEvent: any, private lambdaCallback: Callback) {

    }
    ok(httpCode: number = 200, response?: any) {
        const result = {
            statusCode: httpCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
            body: null
        };
        if (response) {
            console.log(`in http ok with response ${response}`);
            console.log(`in http ok with result.body ${result.body}`);
            result.body = JSON.stringify(response);
        } else {
            result.body = 'Successfully processed request';
        }
        this.lambdaCallback(null, result);
    }

    fail(error: any, httpCode: number = 500, response?: any) {
        const result = {
            statusCode: httpCode,
            headers: {},
            body: null
        };

        if (response) {
            result.body = JSON.stringify(response);
        } else {
            result.body = 'Failed to process request';
        }
        this.lambdaCallback(error, result);
    }

    getPathParameters(): any {
        return this.lambdaEvent.pathParameters;
    }

    getRequestBody(): any {
        console.log('body = ', this.lambdaEvent.body);
        if (typeof this.lambdaEvent.body === 'string') {
            this.lambdaEvent.body = JSON.parse(this.lambdaEvent.body);
        }
        return this.lambdaEvent.body;
    }

    getQueryStringParameters(): any {
        return this.lambdaEvent.queryStringParameters;
    }

    getHttpMethod(): any {
        return this.lambdaEvent.httpMethod;
    }

    getRequestContext(): any {
        return this.lambdaEvent.requestContext;
    }
}
