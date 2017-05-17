import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultServiceImpl } from '../service/Result-service';
import { Result } from '../domain/Result';


@Injectable()
export class ResultFacade {

    constructor(private resultService: ResultServiceImpl) {
        console.log('in QsnPaperFacade constructor()');
    }

    update(data: any): Observable<Result> {
        console.log('in QsnPaperFacade getAll()');
        return this.resultService.update(data);
    }
}
