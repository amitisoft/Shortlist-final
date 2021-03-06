import _ = require('lodash');
import moment = require('moment');

export interface StreamObject {
    key: string;
    value: string;
}

export interface DBStreamRecord {
    getKeys(): StreamObject[];
    getEventName(): string;
    getNewImage(): StreamObject[];
    getAllUniqueProperties(): any;
    convertToDate(time: number): any;
    getValueByKey(key: string): any;
    addToNewImageAttributes(key: string, value: any): void;
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

    addToNewImageAttributes(key, value): void {
        let newImageObject = this.record.dynamodb.NewImage;
        newImageObject[key] = value;
    }

    getNewImage(): any {
        let newImageObject = this.record.dynamodb.NewImage;
        return this.construct(newImageObject);
    }

    getValueByKey(key: string): any {
        let allProperties = this.getAllUniqueProperties();
        return _.pick(allProperties, [key])[key];
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

    convertToDate(time: any): any {
        console.log(`time for date ${time}`);
        console.log('date==================', new Date(parseInt(time, 10)));
        let dateNow = new Date(parseInt(time, 10));
        console.log(`CONVERTED DATE ${moment(dateNow).format('DD/MM/YYYY')}`);
        return moment(dateNow).format('DD/MM/YYYY');
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
