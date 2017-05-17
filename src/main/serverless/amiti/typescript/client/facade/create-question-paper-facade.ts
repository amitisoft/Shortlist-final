import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{ CreateQuestionPaperserviceImpl } from '../service/create-question-paper-service';
import { Question } from '../domain/question';

@Injectable()
export class CreateQuestionPaperFacade {
    constructor(private createQuestionPaperservice: CreateQuestionPaperserviceImpl) {
        console.log('in CreateQuestionFacade constructor()');
    }

    createQuestionPaper(qsns: any, qsnPaperName: any): Observable<Question> {
        console.log('qsnPaperName........', qsnPaperName);
        return this.createQuestionPaperservice.createQuestionPaper(qsns, qsnPaperName);
    }

    getQuestionPapers(): Observable<Question[]> {
        console.log('in categoryId getQuestionPapers()');
        return this.createQuestionPaperservice.getAllQuestionPaperNames();
    }
}
