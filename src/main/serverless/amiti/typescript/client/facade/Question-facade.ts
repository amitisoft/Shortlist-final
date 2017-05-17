import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionServiceImpl } from '../service/Question-service';
import { Question } from '../domain/Question';


@Injectable()
export class QuestionFacade {

    constructor(private questionService: QuestionServiceImpl) {
        console.log('in QsnPaperFacade constructor()');
    }

    getQsn(qsnId: string, category: string): Observable<Question> {
        console.log('in QsnPaperFacade getAll()', qsnId);
        console.log('in QsnPaperFacade getAll()', category);
        return this.questionService.getQsn(qsnId, category);
    }
}
