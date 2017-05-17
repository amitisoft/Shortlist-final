import { Injector } from '@angular/core';
import { StreamRecord } from './stream-record-impl';
import { Callback, Context } from 'aws-lambda';

export interface StreamLambdaHandler {
    (event: any, context: Context, callback: Callback): void;
}

export interface StreamHandler {
    (context: StreamContextImpl, injector: Injector): void;
}

export class StreamContextImpl {

    constructor(private streamRecord: StreamRecord, private observer: any) {

    }

    getRecord(): StreamRecord {
        return this.streamRecord;
    }

    ok() {
        console.log(`payload received ${JSON.stringify(this.getRecord().getPayload())}`);
        this.observer.next(this.getRecord());
        this.observer.complete();
    }

    fail(error: Error) {
        this.observer.error(error);
    }

}
