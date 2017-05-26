
import { CategoryFacade } from '../facade/Category-facade';
import { Injector } from '@angular/core';
import { HttpContextImpl } from '../../api/http/http-context-impl';

export class CategoryHandler {

    static createCategory (httpContext: HttpContextImpl,injector: Injector): void {
        let body = httpContext.getRequestBody();
        console.log('body in handler '+body);
        injector.get(CategoryFacade).createCategory(body)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
        });
    }

    static getAllCategories(httpContext: HttpContextImpl,injector: Injector): void {
            injector.get(CategoryFacade).getAllCategories()
                .subscribe(result => {
                    httpContext.ok(200, result);
                },  err => {
                    httpContext.fail(err, 500);
                });
    }

   static getCategoryById(httpContext: HttpContextImpl,injector: Injector): void {
        let pathParam = httpContext.getPathParameters();
        let categoryId = pathParam['category'];
        console.log('categoryId= '+categoryId);
        injector.get(CategoryFacade).getCategoryById(categoryId)
            .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
}

 static deleteCategory(httpContext: HttpContextImpl,injector: Injector): void {
            let body = httpContext.getRequestBody();
            let categoryId = body['category'];
            console.log('categoryId= '+categoryId);
            injector.get(CategoryFacade).deleteCategory(categoryId)
               .subscribe(result => {
                httpContext.ok(200, result);
            },  err => {
                httpContext.fail(err, 500);
            });
     }
}