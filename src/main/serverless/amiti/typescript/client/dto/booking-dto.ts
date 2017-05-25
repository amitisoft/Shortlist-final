export class BookingDto {
    bookingId: string;
    candidateId: string;
    category: string;
    jobPosition: string;
    dateOfExam: string;
    paperType: string;
    testStatus: string;
    candidateFullName: string;
    candidateMailId: string;
    startingTime?: string;
    endingTime?:string;
}
