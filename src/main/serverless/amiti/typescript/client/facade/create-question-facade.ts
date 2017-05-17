import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateQuestionServiceImpl } from '../service/create-question-service';
import { Question } from '../domain/question';

@Injectable()
export class CreateQuestionFacade {
    constructor(private createQuestionService: CreateQuestionServiceImpl) {
        console.log('in CreateQuestionFacade constructor()');
    }

    createQuestion(data: any): Observable<Question> {
        return this.createQuestionService.create(data);
    }

    findbyCategory(categoryId: string, lastqsnid: string): Observable<Question[]> {
        console.log('in categoryId findBycategoryId()');
        return this.createQuestionService.findById(categoryId, lastqsnid);
    }
}
