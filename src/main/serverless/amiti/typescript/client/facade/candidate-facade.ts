import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { CandidateServiceImpl, RegisterCandidateInputParams } from '../service/candidate-service';
import { CandidateDto } from '../dto/candidate-dto';
import { CandidatesDto } from '../dto/candidates-dto';
import { Candidate } from '../domain/candidate';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { CandidateSearchParams } from '../service/candidate-service';


@Injectable()
export class CandidateFacade {

    constructor(private candidateService: CandidateServiceImpl) {
        console.log('in CandidateFacade constructor()');
    }

    registerCandidate(params: any): void {
        console.log('in CandidateFacade registerCandidate()');
        this.candidateService.registerCandidate(params)
    }

    findCandidateByEmailId(data: any): Observable<Candidate> {
        return this.candidateService.findCandidateByEmailId(data);
    }

    getAll(): Observable<CandidatesDto> {
        console.log('in CandidateFacade getAll()');
        return this.candidateService.getAll()
            .map((candidates) => {
                return {
                    candidates: candidates.map(this.mapCandidateToDto)
                };
            });
    }

    findbyId(candidateId: string): Observable<Candidate> {
        console.log('in CandidateFacade findById()');
        return this.candidateService.findById(candidateId);
    }

    registerCandidatesAndEmailPostRegistration(params: any): Observable<boolean> {
        console.log('in CandidateFacade registerCandidatesAndEmailPostRegistration()');
        return this.candidateService.registerCandidatesAndEmailPostRegistration(params);
    }
    insertCandidate(data: any): Observable<string> {
        return this.candidateService.insertCandidate(data);
    }

    getCandidateInfoForView(data: any): Observable<CandidateDto> {
          return this.candidateService.getCandidateInfoForView(data);
    }

    // updateCandidateTOElasticSearch
    updateCandidateTOElasticSearch(record: DBStreamRecord): Observable<boolean> {
        console.log(`update candidate in elastic search index by pushing to stream ${JSON.stringify(record)}`);
        return this.candidateService.updateCandidateTOElasticSearch(record);
    }

    findESCandidateSearchResult(searchParams: CandidateSearchParams): Observable<CandidatesDto> {
        return this.candidateService.findESCandidateSearchResult(searchParams)
        .map((candidate) => {
                console.log('map = ', candidate);
                return {
                    candidates: candidate.map(this.mapCandidateToDto)
                };
            });
    }

    private mapCandidateToDto(candidate: Candidate): CandidateDto {
        console.log('in mapCandidateToDto' + JSON.stringify(candidate));
        return {
            candidateId: candidate.candidateId,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phoneNumber: candidate.phoneNumber
        };
    }
}
