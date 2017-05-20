import 'reflect-metadata';
import { ExecutionContextImpl } from './typescript/api/context/execution-context-impl';
import { StreamExecutionContextImpl } from './typescript/api/context/stream-execution-context-impl';
import { GetCandidateHandler } from './typescript/client/web/get-candidate-handler';
import { GetQsnHandler } from './typescript/client/web/get-Question-handler';
import { UpdateResultHandler } from './typescript/client/web/update-Result-handler';
import { CreateQuestionHandler } from './typescript/client/web/create-question-handler';
import { QuestionPaperHandler } from './typescript/client/web/question-paper-handler';
import { TestLinkHandler } from './typescript/client/web/test-link-handler';
import { GetBookingHandler } from './typescript/client/web/get-booking-handler';

import { CandidateServiceImpl } from './typescript/client/service/candidate-service';
import { CandidateFacade } from './typescript/client/facade/candidate-facade';
import { BookingServiceImpl } from './typescript/client/service/booking-service';
import { BookingFacade } from './typescript/client/facade/booking-facade';
import { NotificationServiceImpl } from './typescript/client/service/notification-service';
import { QsnIdsServiceImpl } from './typescript/client/service/QsnIds-service';
import { QsnIdsFacade } from './typescript/client/facade/QsnIds-facade';
import { QuestionServiceImpl } from './typescript/client/service/Question-service';
import { QuestionFacade } from './typescript/client/facade/Question-facade';
import { ResultServiceImpl } from './typescript/client/service/Result-service';
import { ResultFacade } from './typescript/client/facade/Result-facade';
import { CreateQuestionFacade } from './typescript/client/facade/create-question-facade';
import { CreateQuestionServiceImpl } from './typescript/client/service/create-question-service';
import { CreateQuestionPaperFacade } from './typescript/client/facade/create-question-paper-facade';
import { CreateQuestionPaperserviceImpl } from './typescript/client/service/create-question-paper-service';
import { Kinesis } from 'aws-sdk';


let candidateServiceImplFactory = (notificationServiceImpl: NotificationServiceImpl) => {
    let kinesis = new Kinesis({
        region: process.env.KINESIS_STREAM_REGION
    });
    return new CandidateServiceImpl(notificationServiceImpl, kinesis);
};

let bookingServiceImplFactory = () => {
    return new BookingServiceImpl(process.env.ELASTICSEARCH_ENDPOINT, process.env.REGION);
};
export const appProviders = [
    CandidateFacade,
    BookingFacade,
    {
        provide: BookingServiceImpl,
        useFactory: bookingServiceImplFactory,
        deps: []
    },
    {
        provide: CandidateServiceImpl,
        useFactory: candidateServiceImplFactory,
        deps: [NotificationServiceImpl]
    },
    NotificationServiceImpl,
    QsnIdsServiceImpl,
    QsnIdsFacade,
    QuestionServiceImpl,
    QuestionFacade,
    ResultServiceImpl,
    ResultFacade,
    CreateQuestionFacade,
    CreateQuestionServiceImpl,
    CreateQuestionPaperFacade,
    CreateQuestionPaperserviceImpl
];



exports.gettestStausInfo = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.isActiveLink);
exports.getAllCandidatesFunction = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.getAllCandidates);
exports.registerCandidate = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.registerCandidate);
exports.registerCandidatesAndEmailPostRegistration = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.registerCandidatesAndEmailPostRegistration);
exports.processRegistrationStream = StreamExecutionContextImpl.createMergedStreamHandler(appProviders, GetCandidateHandler.processRegistrationStream);
exports.startTestDashboard = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.startTestDashboard);
exports.getCandidateHomePageInfo = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.getCandidateHomePageInfo);
exports.updateBookingAfterStartTest = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.updateBookingAfterStartTest);
exports.getAllQsnIdsFunction = ExecutionContextImpl.createHttpHandler(appProviders, GetQsnHandler.getQsn);
exports.updateResultFunction = ExecutionContextImpl.createHttpHandler(appProviders, UpdateResultHandler.updateResult);
exports.createQuestionPaperFunction = ExecutionContextImpl.createHttpHandler(appProviders, QuestionPaperHandler.createQuestionPaper);
exports.createQuestionFunction = ExecutionContextImpl.createHttpHandler(appProviders, CreateQuestionHandler.createQuestion);
exports.getQuestionByCategoryFunction = ExecutionContextImpl.createHttpHandler(appProviders, CreateQuestionHandler.getQuestionByCategory);
exports.createTestLinkFunction = ExecutionContextImpl.createHttpHandler(appProviders, TestLinkHandler.findCandidateByEmailId);
exports.getQuestionPaperNamesFunction = ExecutionContextImpl.createHttpHandler(appProviders, QuestionPaperHandler.getQuestionPaperNames);
exports.performESUpdateForBooking = StreamExecutionContextImpl.createBookingDBStreamHandler(appProviders, GetBookingHandler.performElasticSearchUpdate);
