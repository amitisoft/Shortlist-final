import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { QuestionServiceImpl } from '../service/Question-service';
import { QuestionDto } from '../dto/Question-dto';
import { Question } from '../domain/Question';


@Injectable()
export class QuestionFacade {

    constructor(private questionService: QuestionServiceImpl) {
        console.log('in QsnPaperFacade constructor()');
    }

    // getQsn(questionId: string,category:string,total_No_of_Qsns:number,bookingId:string): Observable<QuestionDto> {
    //      console.log('in QsnPaperFacade getAll()', questionId);
    //      console.log('in QsnPaperFacade getAll()', category);
    //      console.log('inQsnPaperFacade getAll()', bookingId);
    //      console.log('QsnPaperFacade getAll()', total_No_of_Qsns);
    //      return this.questionService.getQsn(questionId,category,total_No_of_Qsns,bookingId);
            
    // }


    getNextQuestion(data:any): Observable<QuestionDto> {
        return this.questionService.getNextQuestion(data);
      }

    // findbyId(candidateId: string): Observable<QsnPaper> {
    //     console.log('in CandidateFacade findById()');
    //     return this.QsnPaperService.findById(candidateId);
    // }

    // findbyEmail(candidateId:string): Observable<Candidate> {
    //     console.log('in CandidateFacade findById()');
    //     return this.candidateService.findById(candidateId);
    // }


    // private mapCandidateToDto(candidate: Candidate): CandidateDto {
    //     console.log('in mapCandidateToDto' + JSON.stringify(candidate));
    //     return {
    //         candidateId: candidate.candiateId,
    //         fullName: `${candidate.firstName} ${candidate.lastName}`,
    //         email: candidate.email
    //     }
    // }
}
