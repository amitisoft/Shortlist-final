import {CandidateServiceImpl} from "../../client/service/candidate-service";
import {CandidateFacade} from "../../client/facade/candidate-facade";

import {BookingServiceImpl} from "../../client/service/booking-service";
import {BookingFacade} from "../../client/facade/booking-facade";
import {NotificationServiceImpl} from "../../client/service/notification-service";

import {QsnIdsServiceImpl} from "../../client/service/QsnIds-service";
import {QsnIdsFacade} from "../../client/facade/QsnIds-facade";
import {QuestionServiceImpl} from "../../client/service/Question-service";
import {QuestionFacade} from "../../client/facade/Question-facade";
import {ResultServiceImpl} from "../../client/service/Result-service";
import {ResultFacade} from "../../client/facade/Result-facade";

import { CreateQuestionFacade } from '../../client/facade/create-question-facade';
import{CreateQuestionServiceImpl} from '../../client/service/create-question-service';
import { CreateQuestionPaperFacade } from '../../client/facade/create-question-paper-facade';
import{createQuestionPaperserviceImpl} from '../../client/service/create-question-paper-service';


export const AppProviders = [
    CandidateServiceImpl,
    CandidateFacade,
    BookingFacade,
    BookingServiceImpl,
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
    createQuestionPaperserviceImpl
];