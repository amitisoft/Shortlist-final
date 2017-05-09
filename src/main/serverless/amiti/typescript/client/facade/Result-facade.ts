import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {ResultServiceImpl} from '../service/Result-service';
import {ResultDto} from '../dto/Result-dto';
import {Result} from '../domain/Result';


@Injectable()
export class ResultFacade {

    constructor(private ResultService: ResultServiceImpl) {
        console.log("in QsnPaperFacade constructor()");
    }

    update(data:any): Observable<ResultDto> {
        console.log("in QsnPaperFacade getAll()");

        return this.ResultService.update(data);
            // .map((candidates) => {
            //     return {
            //         candidates: candidates.map(this.mapCandidateToDto)
            //     }
            // });
    }

}