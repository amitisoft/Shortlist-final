export interface StreamRecord {
    getPayload(): any;
    getSequenceNumber(): string;
    getPartitionKey(): string;
}

export class StreamRecordImpl implements StreamRecord {

    constructor(private record: any) {

    }

    getPayload(): any {
        const encodedPayload = this.record.kinesis.data;
        const payload = JSON.parse(new Buffer(encodedPayload, 'base64').toString('ascii'));
        return payload;
    }

    getSequenceNumber(): string {
        return this.record.kinesis.sequenceNumber;
    }

    getPartitionKey(): string {
        return this.record.kinesis.partitionKey;
    }
}

