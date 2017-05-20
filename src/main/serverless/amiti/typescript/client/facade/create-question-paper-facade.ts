import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import{ CreateQuestionPaperserviceImpl } from '../service/create-question-paper-service';
import { Question } from '../domain/question';

@Injectable()
export class CreateQuestionPaperFacade {
     constructor(private createQuestionPaperservice: CreateQuestionPaperserviceImpl) {
        console.log("in CreateQuestionFacade constructor()");
    }
   
    createQuestionPaper(data: any) : Observable<Question> {
        // console.log("data----",data);
        //  console.log("data type of----",typeof data);
        //   let data1 = JSON.parse(data);
        // console.log("data type of----",typeof data1);
        return this.createQuestionPaperservice.createQuestionPaper(data);
    } 

}