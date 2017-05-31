import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ResultSearchParams, ResultServiceImpl } from '../service/Result-service';
import { ResultDto } from '../dto/Result-dto';
import { Result } from '../domain/Result';
import { ResultSearchDto } from '../dto/resultSearch-dto';
import { ResultsSearchDto } from '../dto/resultsSearch-dto';
import { ResultSearch } from '../domain/resultSearch';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';

@Injectable()
export class ResultFacade {

    constructor(private resultService: ResultServiceImpl) {
        console.log('in QsnPaperFacade constructor()');
    }
       update(data: any): Observable<ResultDto> {
        console.log('in Results Facade: Update Results');
        return this.resultService.update(data);
           }
 updateResultTOElasticSearch(record: DBStreamRecord): Observable<boolean> {
       // console.log(`update Result in elastic search index by pushing to stream ${JSON.stringify(record)}`);
        return this.resultService.updateResultToElasticSearch(record);
    }

     findESResultSearch(searchParams: ResultSearchParams): Observable<ResultsSearchDto> {
        return this.resultService.findESResultSearch(searchParams)
            .map((resultsSearch) => {
                console.log('map = ', resultsSearch);
                return {
                    resultsSearch: resultsSearch.map(this.mapResultSearchToDto)
                };
            });
    }

       private mapResultSearchToDto(resultSearch: ResultSearch): ResultSearchDto {
        console.log('in mapBookingToDto', resultSearch);
        let correctlyAnsweredQsn = 25 ;
        let percentage = (correctlyAnsweredQsn / resultSearch.totalNoOfQsnsPerQsnPaperId) * 100 ;

        return {
            candidateId: resultSearch.candidateId,
            fullName: resultSearch.fullName,
            email: resultSearch.email,
            phoneNumber: resultSearch.phoneNumber,
            bookingId: resultSearch.bookingId,
            jobPosition: resultSearch.jobPosition,
            dateOfExam: resultSearch.dateOfExam,
            score: resultSearch.score,
            totalNoOfQsnsPerQsnPaperId: resultSearch.totalNoOfQsnsPerQsnPaperId,
            correctlyAnsweredQsn: correctlyAnsweredQsn,
            percentage: percentage,
        };
    }

}
