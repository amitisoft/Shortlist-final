import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import{ CreateQuestionPaperserviceImpl } from '../service/create-question-paper-service';
import { Question } from '../domain/question';

@Injectable()
export class CreateQuestionPaperFacade {
    constructor(private createQuestionPaperservice: CreateQuestionPaperserviceImpl) {
        console.log('in CreateQuestionFacade constructor()');
    }

    createQuestionPaper(data: any, qsnPaperName: string): Observable<Question> {
        return this.createQuestionPaperservice.createQuestionPaper(data, qsnPaperName);
    }

    getQuestionPapers(): Observable<Question[]> {
        console.log('in categoryId getQuestionPapers()');
        return this.createQuestionPaperservice.getAllQuestionPaperNames();
    }
}
