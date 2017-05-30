import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import{ CategoryServiceImpl } from '../service/Category-Service';
import { Category } from '../domain/Category';


@Injectable()
export class CategoryFacade {

     constructor(private categoryService: CategoryServiceImpl) {
       }
    createCategory(data: any): Observable<Category> {
        return this.categoryService.createCategory(data);
 }

     getAllCategories(): Observable<Category[]> {
        return this.categoryService.getAllCategories();
    }

    getCategoryById(categoryId: string): Observable<Category> {
         return this.categoryService.getCategoryById(categoryId);
    }

    deleteCategory(categoryId: string): Observable<Category> {
        return this.categoryService.deleteCategory(categoryId);
    }
}