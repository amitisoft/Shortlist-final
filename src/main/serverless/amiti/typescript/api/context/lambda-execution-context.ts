import { CustomLambdaEvent, LambdaContextImpl } from '../lambda/lambda-context-impl';
import { Injector, ReflectiveInjector } from '@angular/core';
import { Callback, Context } from 'aws-lambda';

export interface LambdaHandler {
    (context: LambdaContextImpl, injector: Injector): void;
}

export interface CustomLambdaHandler {
    (event: CustomLambdaEvent, context: Context, callback: Callback): void;
}


export class LambdaExecutionContext {

    static createLambdaHandler(providers: any[], handler: LambdaHandler): CustomLambdaHandler {
        return (lambdaEvent: CustomLambdaEvent, lambdaContext: Context, lambdaCallback: Callback) => {
            const customContext = new LambdaContextImpl(lambdaEvent, lambdaContext, lambdaCallback);
            try {
                const handlerProviders = [
                    {provide: LambdaContextImpl, useValue: customContext}
                ].concat(providers);
                const injector = ReflectiveInjector.resolveAndCreate(handlerProviders);

                handler(customContext, injector);

            } catch (e) {
                console.error(e);
                customContext.fail(e, 'Lambda Failed');
            }
        };
    }
}
