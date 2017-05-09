import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {QsnIdsServiceImpl} from '../service/QsnIds-service';
import {QsnIdsDto} from '../dto/QsnIds-dto';
import {QsnIds} from '../domain/QsnIds';


@Injectable()
export class QsnIdsFacade {

    constructor(private QsnIdsService: QsnIdsServiceImpl) {
        console.log("in QsnPaperFacade constructor()");
    }

    getQsnId(Qsn_Ppr_Id:string): Observable<QsnIdsDto[]> {
        console.log("in QsnPaperFacade getAll()");

        return this.QsnIdsService.getQsnId(Qsn_Ppr_Id);
            // .map((candidates) => {
            //     return {
            //         candidates: candidates.map(this.mapCandidateToDto)
            //     }
            // });
    }

}