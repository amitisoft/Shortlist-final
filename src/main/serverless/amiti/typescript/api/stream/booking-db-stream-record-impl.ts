const _ = require('lodash');

export interface StreamObject {
    key: string;
    value: string;
}

export interface DBStreamRecord {
    getKeys(): StreamObject[];
    getEventName(): string;
    getNewImage(): StreamObject[];
    getAllUniqueProperties(): any;
}

export class DBStreamRecordImpl implements DBStreamRecord {
    constructor(private record: any) {

    }

    getKeys(): StreamObject[] {
        let returnKeys = [];
        let keys = this.record.dynamodb.Keys;
        return this.construct(keys);
    }

    getEventName(): string {
        return this.record.eventName;
    }

    getNewImage(): any {
        let newImageObject = this.record.dynamodb.NewImage;
        return this.construct(newImageObject);
    }

    getAllUniqueProperties(): any {
        let allProperties = _.uniqBy(_.flatMap([this.getKeys(), this.getNewImage()], (n) => {
            return n;
        }), 'key');


        let params = {};
        allProperties.forEach((obj) => {
            params[obj['key']] = obj['value'];
        });
        return params;
    }

    private construct(obj): any {
        let returnObj = [];
        Object.getOwnPropertyNames(obj)
            .forEach((property) => {
                let pValue = '';
                if (typeof obj[property] === 'object') {
                    let innerObj = obj[property];
                    Object.getOwnPropertyNames(innerObj)
                        .forEach((innerKey) => {
                            pValue = innerObj[innerKey];
                        });
                }
                returnObj.push({
                    'key': property,
                    'value': pValue
                });
            });
        return returnObj;
    }
}
