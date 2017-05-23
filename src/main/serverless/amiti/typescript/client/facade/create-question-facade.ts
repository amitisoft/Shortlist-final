import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { CreateQuestionServiceImpl } from '../service/create-question-service';
import { Question } from '../domain/question';

@Injectable()
export class CreateQuestionFacade {
     constructor(private createQuestionservice: CreateQuestionServiceImpl) {
        console.log(`in CreateQuestionFacade constructor()`);
    }
    createQuestion(data: any): Observable<Question> {
    //     let dataConversion:any;
    //     console.log("data before type of----",typeof data);
    //   if (typeof data == 'string'){
    //     dataConversion = JSON.parse(data);
    //   }
    //   else{
    //     dataConversion = data;
    //   }
    //     console.log("data After type of----",typeof dataConversion);
        return this.createQuestionservice.create(data);
    }

     findbyCategory(categoryId: string, lastqsnid: string): Observable<Question[]> {
        console.log(`in categoryId findBycategoryId()`);
        return this.createQuestionservice.findById(categoryId, lastqsnid);
    }
}
