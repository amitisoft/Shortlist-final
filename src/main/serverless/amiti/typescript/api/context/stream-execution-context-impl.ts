import { ReflectiveInjector } from '@angular/core';
import { Callback, Context } from 'aws-lambda';
import { StreamLambdaHandler, StreamContextImpl, StreamHandler } from '../stream/stream-context-impl';
import { StreamRecord, StreamRecordImpl } from '../stream/stream-record-impl';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';


export class StreamExecutionContextImpl {

    static createMergedStreamHandler(providers: any[], handler: StreamHandler): StreamLambdaHandler {
        return (lambdaEvent: any, lambdaContext: Context, lambdaCallback: Callback) => {
            try {
                let streamContext: StreamContextImpl = null;
                const streamRecords: StreamRecord[] = lambdaEvent.Records.map((record: any) => new StreamRecordImpl(record));
                Observable.from(streamRecords)
                    .mergeMap((record: StreamRecord) => Observable.create((observer: any) => {
                        streamContext = new StreamContextImpl(record, observer);

                        try {
                            const handlerProviders = [
                                {provide: StreamContextImpl, useValue: streamContext}
                            ].concat(providers);

                            const streamInjector = ReflectiveInjector.resolveAndCreate(handlerProviders);

                            handler(streamContext, streamInjector);

                        } catch (e) {
                            streamContext.fail(e);
                        }

                    }))
                    .subscribe((next: any) => {
                        lambdaCallback(null, next);
                    }, (err: any) => {
                        console.log(err);
                    }, () => {
                        lambdaCallback(null, 'Sucessfully Finished!!!');
                    });


            } catch (e) {
                console.error(e);
            }
        };
    }

    static createSerializedStreamHandler(providers: any[], handler: StreamHandler): StreamLambdaHandler {
        return (lambdaEvent: any, lambdaContext: Context, lambdaCallback: Callback) => {
            try {
                let streamContext: StreamContextImpl = null;
                const streamRecords: StreamRecord[] = lambdaEvent.Records.map((record: any) => new StreamRecordImpl(record));

                Observable.from(streamRecords)
                    .concatMap((record: StreamRecord) => Observable.create((observer: any) => {
                        streamContext = new StreamContextImpl(record, observer);

                        try {
                            const handlerProviders = [
                                {provide: StreamContextImpl, useValue: streamContext}
                            ].concat(providers);

                            const streamInjector = ReflectiveInjector.resolveAndCreate(handlerProviders);

                            handler(streamContext, streamInjector);
                        } catch (e) {
                            streamContext.fail(e);
                        }

                    }))
                    .subscribe((next: any) => {
                        lambdaCallback(null, next);
                    }, (err: any) => {
                        console.log(err);
                    }, () => {
                        lambdaCallback(null, 'Successfully Finished!!!');
                    });


            } catch (e) {
                console.error(e);
            }
        };
    }
}
