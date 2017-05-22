import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import{ CreateQuestionPaperserviceImpl } from '../service/create-question-paper-service';
import { Question } from '../domain/question';
import { QuestionPaper } from '../domain/questionPaper';

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

     getQuestionPapersId(category: string): Observable<QuestionPaper[]> {
        console.log('in categoryId getQuestionPapersId()');
        console.log('fetching');
        return this.createQuestionPaperservice.getQuestionPaperId(category);
    }

     getQuestionPaperNamesByCategory(qsnId: any): Observable<QuestionPaper[]> {
        console.log('in categoryId getQuestionPapersId()');
        console.log('fetching');
        return this.createQuestionPaperservice.getPaperNamesByCategory(qsnId);
    }
}
