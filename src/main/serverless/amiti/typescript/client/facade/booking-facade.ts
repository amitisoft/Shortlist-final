import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BookingSearchParams, BookingServiceImpl } from '../service/booking-service';
import { BookingDto } from '../dto/booking-dto';
import { BookingsDto } from '../dto/bookings-dto';
import { Booking } from '../domain/booking';
import { DBStreamRecord } from '../../api/stream/db-stream-record-impl';
import { Candidate } from '../domain/candidate';


@Injectable()
export class BookingFacade {

    constructor(private bookingService: BookingServiceImpl) {
    }

    updateBookingAfterStartTest(data: any): Observable<Booking> {
        return this.bookingService.updateBookingAfterStartTest(data);
    }

    getTestInProgressBooking(): Observable<Booking[]> {
        return this.bookingService.getTestInProgressBooking();
    }

    getWhoNotTakenTest(data: any): Observable<Booking[]> {
        return this.bookingService.getWhoNotTakenTest(data);
    }

    getAllCandidateInfoWhoNotTakenTest(data: any): Observable<BookingsDto> {
        console.log('in BookingFacade getAll()');

        return this.bookingService.getAllCandidateInfoWhoNotTakenTest(data)
            .map((bookings) => {
                console.log('map = ', bookings);
                return {
                    bookings: bookings.map(this.mapBookingToDto)
                };
            });
    }


    getCandidateHomePageInfo(data: any): any {
        return this.bookingService.getCandidateHomePageInfo(data);
    }

    candidateTokenChecking(data: any, pathParameter: any): any {
        return this.bookingService.candidateTokenChecking(data, pathParameter);
    }

    updateBookingInElasticSearch(record: DBStreamRecord): Observable<boolean> {
        console.log(`update booking in elastic search index by pushing to stream ${JSON.stringify(record)}`);
        return this.bookingService.updateBookingToElasticSearch(record);
    }

    getAllCandidateInfoWhoAreTestProgress(data: any): Observable<BookingsDto> {
        console.log('in BookingFacade getAll()');


        return this.bookingService.getAllCandidateInfoWhoNotTakenTest(data)
            .map((bookings) => {
                console.log('map = ', bookings);
                return {
                    bookings: bookings.map(this.mapBookingToDto)
                };
            });
    }


    

    findByCandidateId(candidateId: string, data: any): Observable<Booking[]> {
        console.log('in BookingFacade findByCandidateId()');
        // return this.bookingService.findByCandidateId(candidateId, data);
        return null;
    }

    getCandidatesListFile(data: any): Observable<Candidate[]> {
        console.log('in reading candidateList file');
        return this.bookingService.getCandidatesListFile(data);
    }

    getESTestNotTakenResults(): Observable<BookingsDto> {
        return this.bookingService.getESTestNotTakenResults()
            .map((bookings) => {
                console.log('map = ', bookings);
                return {
                    bookings: bookings.map(this.mapBookingToDto)
                };
            });
    }

    getESTestInProgressResults(): Observable<BookingsDto> {
        return this.bookingService.getESTestInProgressResults()
            .map((bookings) => {
                console.log('map = ', bookings);
                return {
                    bookings: bookings.map(this.mapBookingToDto)
                };
            });
    }

    findESBookingSearchResult(searchParams: BookingSearchParams): Observable<BookingsDto> {
        return this.bookingService.findESBookingSearchResult(searchParams)
            .map((bookings) => {
                console.log('map = ', bookings);
                return {
                    bookings: bookings.map(this.mapBookingToDto)
                };
            });
    }


    private mapBookingToDto(booking: Booking): BookingDto {
        console.log('in mapBookingToDto', booking);
        return {
            candidateId: booking.candidateId,
            category: booking.category,
            jobPosition: booking.jobPosition,
            dateOfExam: booking.dateOfExam,
            testStatus: booking.testStatus,
            paperType: booking.paperType,
            candidateFullName: booking.fullName,
            candidateMailId: booking.email,
            bookingId: booking.bookingId
        };
    }


    isTestLinkStatusInfo(data: any): Observable<Booking> {
        console.log('in BookingFacade isTestLinkStatusInfo()');
        return this.bookingService.isTestLinkStatusInfo(data);
    }

    updateExamTimingSlots(data: any):Observable<string>{
        return this.bookingService.updateExamTimingSlots(data);
    }
}
