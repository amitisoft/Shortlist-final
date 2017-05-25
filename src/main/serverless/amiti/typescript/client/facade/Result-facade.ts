import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ResultServiceImpl } from '../service/Result-service';
import { ResultDto } from '../dto/Result-dto';
import { Result } from '../domain/Result';
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
            // .map((candidates) => {
            //     return
            //         candidates: candidates.map(this.mapCandidateToDto)
            //     }
            // });

 updateResultTOElasticSearch(record: DBStreamRecord): Observable<boolean> {
       // console.log(`update Result in elastic search index by pushing to stream ${JSON.stringify(record)}`);
        return this.resultService.updateResultToElasticSearch(record);
    }
}
