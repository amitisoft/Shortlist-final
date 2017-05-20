import { Callback, Context } from 'aws-lambda';
import { LambdaHandler } from '../http/http-context-impl';
import { QueueRecordImpl, QueueRecord, RecordFields } from '../queue/queue-record-impl';
import { SQS, AWSError, Lambda } from 'aws-sdk';

const async = require('async');
const WORKER_LAMBDA_FUNCTION_NAME = 'LAMBDA_FUNCTION_NAME';
const QUEUE_URL = 'SQS_QUEUE_URK';
const sqs = new SQS({region: 'us-east-1'});
const lambda = new Lambda({region: 'us-east-1'});

export class QueueExecutionContextImpl {


    static queueWorkerLambda(): LambdaHandler {
        return (lambdaEvent: any, lambdaContext: Context, lambdaCallback: Callback) => {
            console.log('received:' + JSON.stringify(lambdaEvent.body));
            const task: QueueRecord = JSON.parse(lambdaEvent.body);
            console.log(task.getMessageType());
            console.log(task.getPayload());

        };
    }

    static processQueueMessages(): LambdaHandler {
        return (lambdaEvent: any, lambdaContext: Context, lambdaCallback: Callback) => {
            QueueExecutionContextImpl.handleQueueMessage(lambdaContext, lambdaCallback);
        };
    }

    private static invokeQueueProcessingLambdaFunction(task: QueueRecord, lambdaCallback: Callback) {
        console.log('invokeQueueProcessingLambdaFunction');
        let params = {
            FunctionName: WORKER_LAMBDA_FUNCTION_NAME,
            InvocationType: 'Event',
            Payload: JSON.stringify(task)
        };
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.error(err, err.stack);
                lambdaCallback(err);
            } else {
                lambdaCallback(null, data);
            }
        });
    }

    private static handleQueueMessage(lambdaContext: Context, lambdaCallback: Callback): void {
        QueueExecutionContextImpl.receiveMessages((err, messages) => {
            if (err) {
                console.log(err);
                return lambdaCallback(err);
            }
            if (messages && messages.length > 0) {
                let invocations = [];
                messages
                    .map((message: RecordFields) => {
                        return new QueueRecordImpl(message);
                    })
                    .forEach((qRecord: QueueRecord) => {
                        invocations.push((lambdaCallback1) => {
                            QueueExecutionContextImpl.invokeQueueProcessingLambdaFunction(qRecord, lambdaCallback1);
                        });
                    });

                async.parallel(invocations, (error: any, result) => {
                    if (error) {
                        return lambdaCallback(error);
                    }
                    lambdaCallback(null, 'DONE with processing');
                });
            }


        });
    }

    private static receiveMessages(callback: any) {
        let params = {
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 5
        };
        sqs.receiveMessage(params, (err: any, data: SQS.Types.ReceiveMessageResult) => {
            if (err) {
                console.log('error in process queue:' + err);
                return callback(err);
            }
            callback(null, data.Messages);
        });

    }
}
