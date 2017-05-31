import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { QsnIdsServiceImpl } from '../service/QsnIds-service';
import { QsnIdsDto } from '../dto/QsnIds-dto';
import { QsnIds } from '../domain/QsnIds';


@Injectable()
export class QsnIdsFacade {

    constructor(private qsnIdsService: QsnIdsServiceImpl) {
        console.log('in QsnPaperFacade constructor()');
    }

    //    getQsnId(questionPaperId: string): Observable<QsnIdsDto[]> {
    //     console.log('in QsnPaperFacade getAll()');
    //     return this.qsnIdsService.getQsnId(questionPaperId);
    //           }

}
