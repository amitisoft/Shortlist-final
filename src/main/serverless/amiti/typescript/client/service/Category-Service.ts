import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DynamoDB, SES } from 'aws-sdk';
import { Category } from '../domain/Category';


const AWS = require('aws-sdk');
let uuid = require('uuid');

import DocumentClient = DynamoDB.DocumentClient;

@Injectable()
export class CategoryServiceImpl {

  constructor() {
      }

    createCategory(data: any): Observable<Category> {
        const documentClient = new DocumentClient();
        let params: any = {};
        let uuidd = uuid.v4();
  if(typeof data === 'string') {
      data = JSON.parse(data);
      if(data['categoryId'] === '' || data['categoryId'] === undefined) {

             params = {
            TableName: 'category',
            Item: {
                categoryId: uuidd,
                categoryName: data['categoryName'],
                categoryDesc: data['categoryDesc'],
                Multi_flag:true,
                Date:new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
        };
      } else {
          params = {
            TableName: 'category',
            Item: {
                categoryId: data['categoryId'],
                categoryName: data['categoryName'],
                categoryDesc: data['categoryDesc'],
                Multi_flag:true,
                Date:new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
        };

      }
 }else {

        if(data['categoryId'] === '' || data['categoryId'] === undefined) {

             params = {
            TableName: 'category',
            Item: {
                categoryId: uuidd,
                categoryName: data['categoryName'],
                categoryDesc: data['categoryDesc'],
                Multi_flag:true,
                Date:new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
        };
      } else {
          params = {
            TableName: 'category',
            Item: {
                categoryId: data['categoryId'],
                categoryName: data['categoryName'],
                categoryDesc: data['categoryDesc'],
                Multi_flag:true,
                Date:new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
        };

      }
     }

        return Observable.create((observer: Observer<Category>) => {
            documentClient.put(params, (err, data1: any) => {
                if(err) {
                    console.log('Error= '+err);
                    if(err.code === 'ConditionalCheckFailedException') {
                        observer.error(err);
                        return;
                    }
                }
                observer.next(data1);
                observer.complete();
            });
        });

    }

    getAllCategories(): Observable<Category[]> {
          const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'category',
            ProjectionExpression: 'categoryId,categoryName,categoryDesc',
           };

        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Category>) => {
            documentClient.scan(queryParams,(err,data: any) => {
              if(err) {
                    observer.error(err);
                   }
                console.log(data.Items);
                observer.next(data.Items);
                observer.complete();
            });
        });

    }

       getCategoryById(categoryId: string): Observable<Category> {
            console.log('categoryId= '+categoryId);
            const queryParams: DynamoDB.Types.QueryInput = {
            TableName: 'category',
            ProjectionExpression: 'categoryId,categoryName,categoryDesc',
            KeyConditionExpression: '#categoryId = :categoryIdFilter',
            ExpressionAttributeNames:{
                '#categoryId': 'categoryId'
            },
            ExpressionAttributeValues: {
                ':categoryIdFilter': categoryId
            }
        };
        const documentClient = new DocumentClient();
        return Observable.create((observer: Observer<Category>) => {
            documentClient.query(queryParams,(err,data: any) => {
                 if(err) {
                    observer.error(err);
                      }
                console.log(`data items receieved ${data.Items}`);
                observer.next(data.Items[0]);
                observer.complete();
            });
        });
    }

    deleteCategory(categoryId: string): Observable<Category> {
        console.log('categoryId= '+categoryId);
        const documentClient = new DocumentClient();
         let params = {
           TableName:'category',
                 Key:{
                       'categoryId':categoryId
                }
            };
 return Observable.create((observer: Observer<string>) => {

      documentClient.delete(params, function(err, data) {
        if (err) {
        console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2));
         observer.error(err);
      } else {
        console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
                observer.next('Category deleted successfully...');
                observer.complete();
     }
  });
});
 }
}