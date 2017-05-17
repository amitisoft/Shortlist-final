export interface QueueRecord {
    getPayload(): any;
    getMessageType(): string;
}

export interface RecordFields {
    messageType: string;
    payload: any;
}

export class QueueRecordImpl implements QueueRecord {

    constructor(private record: RecordFields) {

    }

    getMessageType(): string {
        return this.record.messageType;
    }

    getPayload(): any {
        return JSON.stringify(this.record);
    }
}
