import 'reflect-metadata';
import { appProviders } from './typescript/api/context/app-context';
import { ExecutionContextImpl } from './typescript/api/context/execution-context-impl';
import { StreamExecutionContextImpl } from './typescript/api/context/stream-execution-context-impl';
import { GetCandidateHandler } from './typescript/client/web/get-candidate-handler';
import { GetQsnHandler } from './typescript/client/web/get-Question-handler';
import { UpdateResultHandler } from './typescript/client/web/update-Result-handler';
import { CreateQuestionHandler } from './typescript/client/web/create-question-handler';
import { QuestionPaperHandler } from './typescript/client/web/question-paper-handler';
import { TestLinkHandler } from './typescript/client/web/test-link-handler';
import { GetBookingHandler } from './typescript/client/web/get-booking-handler';


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
