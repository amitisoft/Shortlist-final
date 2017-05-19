import 'reflect-metadata';
import { AppProviders } from './typescript/api/context/app-context';
import { ExecutionContextImpl } from './typescript/api/context/execution-context-impl';
import { StreamExecutionContextImpl } from './typescript/api/context/stream-execution-context-impl';
import { GetCandidateHandler } from './typescript/client/web/get-candidate-handler';
import { GetQsnHandler } from './typescript/client/web/get-Question-handler';
import { updateResultHandler } from './typescript/client/web/update-Result-handler';
import { CreateQuestionHandler } from './typescript/client/web/create-question-handler';
import { QuestionPaperHandler } from './typescript/client/web/question-paper-handler';
import { TestLinkHandler } from './typescript/client/web/test-link-handler';
import { GetBookingHandler } from './typescript/client/web/get-booking-handler';


// exports.gettestStausInfo = ExecutionContextImpl.createHttpHandler(AppProviders, GetBookingHandler.isActiveLink);

exports.getAllCandidatesFunction = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.getAllCandidates);
exports.registerCandidate = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.registerCandidate);
exports.registerCandidatesAndEmailPostRegistration = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.registerCandidatesAndEmailPostRegistration);
exports.processRegistrationStream = StreamExecutionContextImpl.createMergedStreamHandler(AppProviders, GetCandidateHandler.processRegistrationStream);


exports.startTestDashboard = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.startTestDashboard);
exports.getCandidateHomePageInfo = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.getCandidateHomePageInfo);
exports.updateBookingAfterStartTest = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.updateBookingAfterStartTest);
exports.insertCandidate = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.insertCandidate);
 exports.getCandidateInfoForView = ExecutionContextImpl.createHttpHandler(AppProviders, GetCandidateHandler.getCandidateInfoForView);

exports.getAllQsnIdsFunction = ExecutionContextImpl.createHttpHandler(AppProviders, GetQsnHandler.getQsn);
exports.updateResultFunction = ExecutionContextImpl.createHttpHandler(AppProviders, updateResultHandler.updateResult);


exports.createQuestionPaperFunction = ExecutionContextImpl.createHttpHandler(AppProviders, QuestionPaperHandler.createQuestionPaper);
exports.createQuestionFunction = ExecutionContextImpl.createHttpHandler(AppProviders, CreateQuestionHandler.createQuestion);
exports.getQuestionByCategoryFunction = ExecutionContextImpl.createHttpHandler(AppProviders, CreateQuestionHandler.getQuestionByCategory);

exports.createTestLinkFunction = ExecutionContextImpl.createHttpHandler(AppProviders, TestLinkHandler.findCandidateByEmailId);

// exports.getQuestionPaperNamesFunction = ExecutionContextImpl.createHttpHandler(AppProviders, QuestionPaperHandler.getQuestionPaperNames);
