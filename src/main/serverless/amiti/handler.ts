import 'reflect-metadata';
import { ExecutionContextImpl } from './typescript/api/context/execution-context-impl';
import { StreamExecutionContextImpl } from './typescript/api/context/stream-execution-context-impl';
import { GetCandidateHandler } from './typescript/client/web/get-candidate-handler';
import { GetQsnHandler } from './typescript/client/web/get-Question-handler';
import { UpdateResultHandler } from './typescript/client/web/update-Result-handler';
import { CreateQuestionHandler } from './typescript/client/web/create-question-handler';
import { QuestionPaperHandler } from './typescript/client/web/question-paper-handler';
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
import { Kinesis, DynamoDB } from 'aws-sdk';
import { CategoryHandler } from './typescript/client/web/Category-Handler';
import { CategoryFacade } from './typescript/client/facade/Category-facade';
import{ CategoryServiceImpl } from './typescript/client/service/Category-Service';
import DocumentClient = DynamoDB.DocumentClient;


//   const fs = require('fs');
//       const dotenv = require('dotenv');
//     const envConfig = dotenv.parse(fs.readFileSync('.env'));
//     for (let k in envConfig) {
//         if (envConfig.hasOwnProperty(k)) {
//             process.env[k] = envConfig[k];
//         }
//     }


let candidateServiceImplFactory = (notificationServiceImpl: NotificationServiceImpl) => {
    let kinesis = new Kinesis({
        region: process.env.KINESIS_STREAM_REGION
    });
    return new CandidateServiceImpl(process.env.ELASTICSEARCH_ENDPOINT, process.env.REGION, notificationServiceImpl, kinesis, new DocumentClient());
};

let bookingServiceImplFactory = (candidateServiceImpl: CandidateServiceImpl) => {
    console.log(`in process bookingServiceImplFactory ${JSON.stringify(process.env.ELASTICSEARCH_ENDPOINT)}`);
    return new BookingServiceImpl(process.env.ELASTICSEARCH_ENDPOINT, process.env.REGION, new DocumentClient(), candidateServiceImpl);
};

let questionServiceImplFactory = (qsnIdsServiceImpl: QsnIdsServiceImpl,bookingServiceImpl:BookingServiceImpl) => {
      return new QuestionServiceImpl(process.env.REGION, new DocumentClient(), qsnIdsServiceImpl,bookingServiceImpl);
      
}

let resultServiceImplFactory = (candidateServiceImpl: CandidateServiceImpl , bookingServiceImpl: BookingServiceImpl, questionServiceImpl: QuestionServiceImpl) => {
    console.log(`in process bookingServiceImplFactory ${JSON.stringify(process.env.ELASTICSEARCH_ENDPOINT)}`);
    return new ResultServiceImpl(process.env.ELASTICSEARCH_ENDPOINT, process.env.REGION, new DocumentClient(), candidateServiceImpl, bookingServiceImpl, questionServiceImpl);

};
export const appProviders = [
    CandidateFacade,
    BookingFacade,
    QuestionFacade,
    ResultFacade,
    {
        provide: BookingServiceImpl,
        useFactory: bookingServiceImplFactory,
        deps: [CandidateServiceImpl]
    },
    {
        provide: CandidateServiceImpl,
        useFactory: candidateServiceImplFactory,
        deps: [NotificationServiceImpl]
    },
     {
        provide: QuestionServiceImpl,
        useFactory: questionServiceImplFactory,
        deps: [QsnIdsServiceImpl, BookingServiceImpl]
     },
    {
        provide:  ResultServiceImpl,
        useFactory: resultServiceImplFactory,
        deps: [CandidateServiceImpl, BookingServiceImpl, QuestionServiceImpl ]
    },
    NotificationServiceImpl,
    QsnIdsFacade,
    QsnIdsServiceImpl,
    CreateQuestionFacade,
    CreateQuestionServiceImpl,
    CreateQuestionPaperFacade,
    CreateQuestionPaperserviceImpl,
    CategoryFacade,
    CategoryServiceImpl
];


exports.getAllCandidatesFunction = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.getAllCandidates);
exports.registerCandidate = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.registerCandidate);
exports.registerCandidatesAndEmailPostRegistration = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.registerCandidatesAndEmailPostRegistration);
exports.processRegistrationStream = StreamExecutionContextImpl.createMergedStreamHandler(appProviders, GetCandidateHandler.processRegistrationStream);
exports.startTestDashboard = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.startTestDashboard);
exports.startTestInProgressDashboard = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.startTestInProgressDashboard);
exports.getCandidateHomePageInfo = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.getCandidateHomePageInfo);
exports.updateBookingAfterStartTest = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.updateBookingAfterStartTest);
exports.getAllQsnIdsByQuestionPaperId = ExecutionContextImpl.createHttpHandler(appProviders, GetQsnHandler.getQuestion);
exports.updateResultFunction = ExecutionContextImpl.createHttpHandler(appProviders, UpdateResultHandler.updateResult);
exports.createQuestionPaperFunction = ExecutionContextImpl.createHttpHandler(appProviders, QuestionPaperHandler.createQuestionPaper);
exports.createQuestionFunction = ExecutionContextImpl.createHttpHandler(appProviders, CreateQuestionHandler.createQuestion);
exports.getQuestionByCategoryFunction = ExecutionContextImpl.createHttpHandler(appProviders, CreateQuestionHandler.getQuestionByCategory);
exports.getQuestionPaperNamesFunction = ExecutionContextImpl.createHttpHandler(appProviders, QuestionPaperHandler.getQuestionPaperNames);
exports.performESUpdateForBooking = StreamExecutionContextImpl.createBookingDBStreamHandler(appProviders, GetBookingHandler.performElasticSearchUpdate);
exports.insertCandidate = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.insertCandidate);
exports.getCandidateInfoForView = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.getCandidateInfoForView);
exports.getQuestionPaperNamesByCategoryFunction = ExecutionContextImpl.createHttpHandler(appProviders, QuestionPaperHandler.getQuestionPaperNamesByCategory);
exports.getESTestNotTakenResults = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.getESTestNotTakenResults);
exports.getESTestInProgressResults = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.getESTestInProgressResults);
exports.findESBookingSearchResult = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.findESBookingSearchResult);
exports.updateCandidateTOElasticSearch = StreamExecutionContextImpl.createBookingDBStreamHandler(appProviders, GetCandidateHandler.updateCandidateTOElasticSearch);
exports.updateResultTOElasticSearch = StreamExecutionContextImpl.createBookingDBStreamHandler(appProviders, UpdateResultHandler.updateResultTOElasticSearch);
exports.findESResultSearch = ExecutionContextImpl.createHttpHandler(appProviders, UpdateResultHandler.findESResultSearch);
exports.getTestStausInfo = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.isTestLinkStatusInfo);
exports.updateExamBookingTimings = ExecutionContextImpl.createHttpHandler(appProviders, GetBookingHandler.updateExamTimingSlots);
exports.findESCandidateSearchResult = ExecutionContextImpl.createHttpHandler(appProviders, GetCandidateHandler.findESCandidateSearchResult);
 exports.createCategory = ExecutionContextImpl.createHttpHandler(appProviders, CategoryHandler.createCategory);
 exports.getAllCategories = ExecutionContextImpl.createHttpHandler(appProviders, CategoryHandler.getAllCategories);
 exports.getCategoryById = ExecutionContextImpl.createHttpHandler(appProviders, CategoryHandler.getCategoryById);


