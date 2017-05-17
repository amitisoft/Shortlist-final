module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	var app_context_1 = __webpack_require__(2);
	var execution_context_impl_1 = __webpack_require__(34);
	var stream_execution_context_impl_1 = __webpack_require__(36);
	var get_candidate_handler_1 = __webpack_require__(39);
	var get_Question_handler_1 = __webpack_require__(40);
	var update_Result_handler_1 = __webpack_require__(41);
	var create_question_handler_1 = __webpack_require__(42);
	var question_paper_handler_1 = __webpack_require__(43);
	var test_link_handler_1 = __webpack_require__(44);
	var get_booking_handler_1 = __webpack_require__(45);
	exports.gettestStausInfo = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_booking_handler_1.GetBookingHandler.isActiveLink);
	exports.getAllCandidatesFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.getAllCandidates);
	exports.registerCandidate = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.registerCandidate);
	exports.registerCandidatesAndEmailPostRegistration = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.registerCandidatesAndEmailPostRegistration);
	exports.processRegistrationStream = stream_execution_context_impl_1.StreamExecutionContextImpl.createMergedStreamHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.processRegistrationStream);
	exports.startTestDashboard = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.startTestDashboard);
	exports.getCandidateHomePageInfo = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.getCandidateHomePageInfo);
	exports.updateBookingAfterStartTest = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_candidate_handler_1.GetCandidateHandler.updateBookingAfterStartTest);
	exports.getAllQsnIdsFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, get_Question_handler_1.GetQsnHandler.getQsn);
	exports.updateResultFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, update_Result_handler_1.UpdateResultHandler.updateResult);
	exports.createQuestionPaperFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, question_paper_handler_1.QuestionPaperHandler.createQuestionPaper);
	exports.createQuestionFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, create_question_handler_1.CreateQuestionHandler.createQuestion);
	exports.getQuestionByCategoryFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, create_question_handler_1.CreateQuestionHandler.getQuestionByCategory);
	exports.createTestLinkFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, test_link_handler_1.TestLinkHandler.findCandidateByEmailId);
	exports.getQuestionPaperNamesFunction = execution_context_impl_1.ExecutionContextImpl.createHttpHandler(app_context_1.appProviders, question_paper_handler_1.QuestionPaperHandler.getQuestionPaperNames);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("reflect-metadata");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var candidate_service_1 = __webpack_require__(3);
	var candidate_facade_1 = __webpack_require__(19);
	var booking_service_1 = __webpack_require__(20);
	var booking_facade_1 = __webpack_require__(22);
	var notification_service_1 = __webpack_require__(14);
	var QsnIds_service_1 = __webpack_require__(23);
	var QsnIds_facade_1 = __webpack_require__(24);
	var Question_service_1 = __webpack_require__(25);
	var Question_facade_1 = __webpack_require__(26);
	var Result_service_1 = __webpack_require__(27);
	var Result_facade_1 = __webpack_require__(28);
	var create_question_facade_1 = __webpack_require__(29);
	var create_question_service_1 = __webpack_require__(30);
	var create_question_paper_facade_1 = __webpack_require__(32);
	var create_question_paper_service_1 = __webpack_require__(33);
	exports.appProviders = [
	    candidate_service_1.CandidateServiceImpl,
	    candidate_facade_1.CandidateFacade,
	    booking_facade_1.BookingFacade,
	    booking_service_1.BookingServiceImpl,
	    notification_service_1.NotificationServiceImpl,
	    QsnIds_service_1.QsnIdsServiceImpl,
	    QsnIds_facade_1.QsnIdsFacade,
	    Question_service_1.QuestionServiceImpl,
	    Question_facade_1.QuestionFacade,
	    Result_service_1.ResultServiceImpl,
	    Result_facade_1.ResultFacade,
	    create_question_facade_1.CreateQuestionFacade,
	    create_question_service_1.CreateQuestionServiceImpl,
	    create_question_paper_facade_1.CreateQuestionPaperFacade,
	    create_question_paper_service_1.CreateQuestionPaperserviceImpl
	];


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var util_helper_1 = __webpack_require__(6);
	var node_uuid_1 = __webpack_require__(12);
	var aws_sdk_1 = __webpack_require__(13);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	var notification_service_1 = __webpack_require__(14);
	var registration_1 = __webpack_require__(18);
	aws_sdk_1.config.update({
	    region: ' us-east-1'
	});
	var kinesis = new aws_sdk_1.Kinesis(aws_sdk_1.config);
	var CandidateServiceImpl = (function () {
	    function CandidateServiceImpl(notificationServiceImpl) {
	        this.notificationServiceImpl = notificationServiceImpl;
	        console.log('in CandidateServiceImpl constructor()');
	    }
	    CandidateServiceImpl.prototype.registerCandidatesAndEmailPostRegistration = function (params) {
	        console.log("registerCandidatesAndEmailPostRegistration " + JSON.stringify(params));
	        var registrations = params.emails.map(function (email) {
	            var registation = new registration_1.Registration();
	            registation.email = email;
	            registation.emailBody = params.emailBody;
	            registation.emailSubject = params.emailSubject;
	            registation.category = params.category;
	            registation.jobPosition = params.jobPosition;
	            return registation;
	        });
	        var streamInputRecords = registrations.map(function (registration) {
	            var encodedData = JSON.stringify({
	                email: registration.email,
	                emailSubject: registration.emailSubject,
	                emailBody: registration.emailBody,
	                jobPosition: registration.jobPosition,
	                category: registration.category
	            });
	            return {
	                PartitionKey: registration.email,
	                Data: encodedData,
	            };
	        });
	        var kinesisParams = {
	            StreamName: 'register-test-stream',
	            Records: streamInputRecords
	        };
	        console.log("kinesis records " + JSON.stringify(kinesisParams));
	        return rxjs_1.Observable.create(function (observer) {
	            kinesis.putRecords(kinesisParams, function (err, data) {
	                if (err) {
	                    console.log(err, err.stack);
	                    observer.next(false);
	                    return;
	                }
	                console.log(data); // successful response
	                data.Records.forEach(function (record) {
	                    console.log("record.SequenceNumber " + record.SequenceNumber);
	                    console.log("record.ShardId " + record.ShardId);
	                });
	                observer.next(true);
	                observer.complete();
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.findCandidateByEmailId = function (email) {
	        console.log("in CandidateServiceImpl isCandidateEmailExists() " + email);
	        var queryParams = {
	            TableName: 'candidate',
	            IndexName: 'emailIndex',
	            ProjectionExpression: 'candidateId',
	            KeyConditionExpression: '#emailId = :emailIdFilter',
	            ExpressionAttributeNames: {
	                '#emailId': 'email'
	            },
	            ExpressionAttributeValues: {
	                ':emailIdFilter': email
	            }
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.query(queryParams, function (err, data) {
	                if (err) {
	                    console.log(err);
	                    return observer.error(err);
	                }
	                if (data.Items.length === 0) {
	                    console.log("Candiate doesn't exists with email " + email);
	                    return observer.error("Candiate doesn't exists with email " + email);
	                }
	                else {
	                    observer.next(data.Items[0]);
	                    observer.complete();
	                    return;
	                }
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.validateBookingForCandidate = function (params) {
	        console.log("params in validateBooking " + JSON.stringify(params));
	        var queryParams = {
	            TableName: 'booking',
	            IndexName: 'candidateId-category-index',
	            ProjectionExpression: 'bookingId,candidateId,category,dateOfExam',
	            KeyConditionExpression: '#candidateId = :candidateIdFilter AND #category = :categoryFilter',
	            FilterExpression: '#date < :dateFilter AND #testStatus <> :testStatusFilter',
	            ExpressionAttributeNames: {
	                '#candidateId': 'candidateId',
	                '#category': 'category',
	                '#date': 'dateOfExam',
	                '#testStatus': 'testStatus'
	            },
	            ExpressionAttributeValues: {
	                ':candidateIdFilter': params.candidate.candidateId,
	                ':categoryFilter': params.category,
	                ':dateFilter': 30,
	                ':testStatusFilter': 'Taken'
	            }
	        };
	        return rxjs_1.Observable.create(function (observer) {
	            var documentClient = new DocumentClient();
	            var queryCallBack$ = rxjs_1.Observable.bindCallback(documentClient.query).bind(documentClient);
	            var result = queryCallBack$(queryParams);
	            result.subscribe(function (x) {
	                console.log("validateBookingForCandidate " + JSON.stringify(x));
	                if (x.Items && x.Items.length > 0) {
	                    console.log("validateBookingForCandidate failed " + x);
	                    observer.next(false);
	                }
	                else {
	                    console.log("validateBookingForCandidate succeeded " + x);
	                    observer.next(true);
	                }
	                observer.complete();
	            }, function (e) {
	                console.log('error in validateBookingForCandidate');
	                // console.error(e);
	                observer.error(e);
	                return;
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.registerCandidate = function (inputParams) {
	        console.log("received " + JSON.stringify(inputParams));
	        var that = this;
	        var registrationWaterFall = util_helper_1.UtilHelper.waterfall([
	            function () {
	                return that.findCandidateByEmailId(inputParams.email);
	            },
	            function (candidate) {
	                console.log('Candidate Received: ' + JSON.stringify(candidate));
	                inputParams.candidate = candidate;
	                return candidate ? that.validateBookingForCandidate(inputParams) :
	                    rxjs_1.Observable.throw(new Error('Candidate does not exist.'));
	            },
	            function (validated) {
	                console.log("in register validated " + validated);
	                if (validated) {
	                    inputParams.token = node_uuid_1.v4();
	                    var uInput = {
	                        token: inputParams.token,
	                        candidateId: inputParams.candidate.candidateId
	                    };
	                    console.log("calling updateCandidateInfo with " + JSON.stringify(uInput));
	                    return that.updateCandidateInfo(uInput);
	                }
	            },
	            function (updatedCandidateSuccessfully) {
	                if (updatedCandidateSuccessfully) {
	                    console.log("calling updateBookingInfo with " + JSON.stringify(inputParams));
	                    return that.updatedBookingInfo(inputParams);
	                }
	            }
	        ]);
	        registrationWaterFall.subscribe(function (x) {
	            console.log("registrationWaterFall result " + JSON.stringify(x));
	            that.doPostRegistrationTasks(inputParams);
	        }, function (err) {
	            console.log("registrationWaterFall failed " + err.stack);
	        });
	    };
	    CandidateServiceImpl.prototype.updateCandidateInfo = function (result) {
	        var that = this;
	        return rxjs_1.Observable.defer(function () {
	            return rxjs_1.Observable.fromPromise(that.updateCandidateInfoPromise(result));
	        });
	    };
	    CandidateServiceImpl.prototype.findById = function (candidateId) {
	        console.log('in CandidateServiceImpl find()');
	        var queryParams = {
	            TableName: 'candidate',
	            ProjectionExpression: 'candidateId, firstName, lastName, email, phoneNumber',
	            KeyConditionExpression: '#candidateId = :candidateIdFilter',
	            ExpressionAttributeNames: {
	                '#candidateId': 'candidateId'
	            },
	            ExpressionAttributeValues: {
	                ':candidateIdFilter': candidateId
	            }
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.query(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    console.log('no data received for getAll candidates');
	                    observer.complete();
	                    return;
	                }
	                data.Items.forEach(function (item) {
	                    console.log("candidate Id " + item.candidateId);
	                    console.log("candidate firstName " + item.firstName);
	                    console.log("candidate lastName " + item.lastName);
	                    console.log("candidate email " + item.email);
	                });
	                observer.next(data.Items[0]);
	                observer.complete();
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.getAll = function () {
	        var that = this;
	        console.log('in CandidateServiceImpl getAll()');
	        var queryParams = {
	            TableName: 'candidate',
	            ProjectionExpression: 'candidateId, firstName, lastName, email',
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.scan(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    console.log('no data received for getAll candidates');
	                    observer.complete();
	                    return;
	                }
	                data.Items.forEach(function (item) {
	                    console.log("candidate Id " + item.candidateId);
	                    console.log("candidate firstName " + item.firstName);
	                    console.log("candidate lastName " + item.lastName);
	                    console.log("candidate email " + item.email);
	                });
	                observer.next(data.Items);
	                observer.complete();
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.doPostRegistrationTasks = function (inputParams) {
	        var message = {
	            email: inputParams.email,
	            emailSubject: inputParams.emailSubject,
	            emailBody: inputParams.emailBody,
	            token: inputParams.token
	        };
	        this.publishSendEmailMessage(message);
	    };
	    CandidateServiceImpl.prototype.publishSendEmailMessage = function (message) {
	        try {
	            this.notificationServiceImpl.sendRegistrationEmail(message)
	                .subscribe(function (x) {
	                console.log("email result " + JSON.stringify(x));
	            }, function (err) {
	                console.log("email failed " + err);
	            });
	        }
	        catch (e) {
	        }
	    };
	    CandidateServiceImpl.prototype.updateBookingInElasticSearch = function () {
	        console.log('update booking in elastic search index by pushing to stream');
	    };
	    CandidateServiceImpl.prototype.updatedBookingInfo = function (inputParams) {
	        return rxjs_1.Observable.create(function (observer) {
	            var testStatus = 'NotTaken';
	            var documentClient = new DocumentClient();
	            var params = {
	                TableName: 'booking',
	                Key: {
	                    bookingId: node_uuid_1.v4()
	                },
	                ExpressionAttributeNames: {
	                    '#cid': 'candidateId',
	                    '#ct': 'category',
	                    '#jp': 'jobPosition',
	                    '#ts': 'testStatus'
	                },
	                ExpressionAttributeValues: {
	                    ':cid': inputParams.candidate.candidateId,
	                    ':ct': inputParams.category,
	                    ':jp': inputParams.jobPosition,
	                    ':ts': testStatus
	                },
	                UpdateExpression: 'SET #cid=:cid,#ct=:ct,#jp=:jp, #ts=:ts',
	                ReturnValues: 'ALL_NEW'
	            };
	            documentClient.update(params, function (err, data) {
	                if (err) {
	                    console.error(err);
	                    observer.error(err);
	                    return;
	                }
	                console.log("Created Booking for Candidate " + inputParams.candidate.candidateId);
	                if (data != null) {
	                    observer.next(true);
	                    observer.complete();
	                }
	            });
	        });
	    };
	    CandidateServiceImpl.prototype.updateCandidateInfoPromise = function (result) {
	        return new Promise(function (resolve, reject) {
	            var documentClient = new DocumentClient();
	            var params = {
	                TableName: 'candidate',
	                Key: {
	                    candidateId: result.candidateId
	                },
	                ExpressionAttributeNames: {
	                    '#tok': 'token'
	                },
	                ExpressionAttributeValues: {
	                    ':tok': result.token
	                },
	                UpdateExpression: 'SET #tok=:tok'
	            };
	            documentClient.update(params, function (err, data) {
	                if (err) {
	                    console.error(err);
	                    reject(err);
	                    return;
	                }
	                console.log('update the TokenId in Candidate Table', result);
	                resolve(true);
	            });
	        });
	    };
	    return CandidateServiceImpl;
	}());
	CandidateServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [notification_service_1.NotificationServiceImpl])
	], CandidateServiceImpl);
	exports.CandidateServiceImpl = CandidateServiceImpl;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("@angular/core");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("rxjs");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	var UtilHelper = (function () {
	    function UtilHelper() {
	    }
	    UtilHelper.waterfall = function (series) {
	        return Observable_1.Observable.defer(function () {
	            var acc = series[0]();
	            for (var i = 1, len = series.length; i < len; i++) {
	                (function (func) {
	                    acc = acc.switchMap(function (x) { return func(x); });
	                }(series[i]));
	            }
	            return acc;
	        });
	    };
	    return UtilHelper;
	}());
	exports.UtilHelper = UtilHelper;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/Observable");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/add/observable/from");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/add/operator/concatMap");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/add/operator/mergeMap");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/add/operator/switchMap");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("node-uuid");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("aws-sdk");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var aws_sdk_1 = __webpack_require__(13);
	__webpack_require__(15);
	var core_1 = __webpack_require__(4);
	var Observable_1 = __webpack_require__(7);
	var path = __webpack_require__(16);
	var fs = __webpack_require__(17);
	var emailConfig = {
	    region: ' us-east-1'
	};
	var NotificationServiceImpl = (function () {
	    function NotificationServiceImpl() {
	    }
	    NotificationServiceImpl.prototype.sendRegistrationEmail = function (message) {
	        var _this = this;
	        var that = this;
	        var emailSES = new aws_sdk_1.SES(emailConfig);
	        var emailPromise = new Promise(function (res, rej) {
	            if (!message.email || !message.emailBody) {
	                rej('Please provide email and message');
	                return;
	            }
	            var emailParams = _this.createEmailParamConfig(message.email, message.emailBody);
	            emailSES.sendEmail(emailParams, function (err, data) {
	                if (err) {
	                    rej("Error in sending out email " + err);
	                    return;
	                }
	                res("Successfully sent email to " + message.email);
	            });
	        });
	        return Observable_1.Observable.defer(function () {
	            return Observable_1.Observable.fromPromise(emailPromise);
	        });
	    };
	    NotificationServiceImpl.prototype.createEmailParamConfig = function (email, message) {
	        var params = {
	            Destination: {
	                BccAddresses: [],
	                CcAddresses: [],
	                ToAddresses: [email]
	            },
	            Message: {
	                Body: {
	                    Html: {
	                        Data: this.generateEmailTemplate(email, message),
	                        Charset: 'UTF-8'
	                    }
	                },
	                Subject: {
	                    Data: 'Testing Email',
	                    Charset: 'UTF-8'
	                }
	            },
	            Source: 'shyamal@amiti.in',
	            ReplyToAddresses: ['shyamal@amiti.in'],
	            ReturnPath: 'shyamal@amiti.in'
	        };
	        return params;
	    };
	    NotificationServiceImpl.prototype.generateEmailTemplate = function (emailFrom, message) {
	        return "\n         <!DOCTYPE html>\n         <html>\n           <head>\n             <meta charset='UTF-8' />\n             <title>title</title>\n           </head>\n           <body>\n            <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>\n             <tr>\n                 <td align='center' valign='top'>\n                     <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>\n                         <tr style='background-color:#99ccff;'>\n                             <td align='center' valign='top'>\n                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailBody'>\n                                     <tr>\n                                         <td align='center' valign='top' style='color:#337ab7;'>\n                                             <h3><a href='http://mail.amiti.in/verify.html?token=" + message + "'>http://mail.amiti.in/verify.html?token=" + message + "</a>\n                                             </h3>\n                                         </td>\n                                     </tr>\n                                 </table>\n                             </td>\n                         </tr>\n                         <tr style='background-color:#74a9d8;'>\n                             <td align='center' valign='top'>\n                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailReply'>\n                                     <tr style='font-size: 1.2rem'>\n                                         <td align='center' valign='top'>\n                                             <span style='color:#286090; font-weight:bold;'>Send From:</span> <br/> " + emailFrom + "\n                                         </td>\n                                     </tr>\n                                 </table>\n                             </td>\n                         </tr>\n                     </table>\n                 </td>\n             </tr>\n             </table>\n           </body>\n         </html>\n";
	    };
	    return NotificationServiceImpl;
	}());
	NotificationServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], NotificationServiceImpl);
	exports.NotificationServiceImpl = NotificationServiceImpl;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = require("rxjs/add/observable/bindNodeCallback");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = require("fs");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";
	var Registration = (function () {
	    function Registration() {
	    }
	    return Registration;
	}());
	exports.Registration = Registration;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var candidate_service_1 = __webpack_require__(3);
	var CandidateFacade = (function () {
	    function CandidateFacade(candidateService) {
	        this.candidateService = candidateService;
	        console.log('in CandidateFacade constructor()');
	    }
	    CandidateFacade.prototype.registerCandidate = function (params) {
	        console.log('in CandidateFacade registerCandidate()');
	        this.candidateService.registerCandidate(params);
	    };
	    CandidateFacade.prototype.findCandidateByEmailId = function (data) {
	        return this.candidateService.findCandidateByEmailId(data);
	    };
	    CandidateFacade.prototype.getAll = function () {
	        var _this = this;
	        console.log('in CandidateFacade getAll()');
	        return this.candidateService.getAll()
	            .map(function (candidates) {
	            return {
	                candidates: candidates.map(_this.mapCandidateToDto)
	            };
	        });
	    };
	    CandidateFacade.prototype.findById = function (candidateId) {
	        console.log('in CandidateFacade findById()');
	        return this.candidateService.findById(candidateId);
	    };
	    CandidateFacade.prototype.registerCandidatesAndEmailPostRegistration = function (params) {
	        console.log('in CandidateFacade registerCandidatesAndEmailPostRegistration()');
	        return this.candidateService.registerCandidatesAndEmailPostRegistration(params);
	    };
	    CandidateFacade.prototype.mapCandidateToDto = function (candidate) {
	        console.log('in mapCandidateToDto' + JSON.stringify(candidate));
	        return {
	            candidateId: candidate.candidateId,
	            fullName: candidate.firstName + " " + candidate.lastName,
	            email: candidate.email
	        };
	    };
	    return CandidateFacade;
	}());
	CandidateFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [candidate_service_1.CandidateServiceImpl])
	], CandidateFacade);
	exports.CandidateFacade = CandidateFacade;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var rxjs_1 = __webpack_require__(5);
	var core_1 = __webpack_require__(4);
	var booking_1 = __webpack_require__(21);
	var aws_sdk_1 = __webpack_require__(13);
	var node_uuid_1 = __webpack_require__(12);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	var AWS = __webpack_require__(13);
	AWS.config.update({
	    region: ' us-east-1'
	});
	var BookingServiceImpl = (function () {
	    function BookingServiceImpl() {
	    }
	    /**
	     * isLinkActive()
	     * Candidate click on TestLink Before test
	     * @param pathParameter
	     */
	    BookingServiceImpl.prototype.isLinkActive = function (pathParameter) {
	        var decodedData = JSON.parse(new Buffer(pathParameter.testLinkinfo, 'base64').toString('ascii'));
	        console.log('in is active method', decodedData.bookingId);
	        var queryParams = {
	            TableName: 'booking',
	            KeyConditionExpression: '#bookingId = :bookingIdData',
	            ExpressionAttributeNames: {
	                '#bookingId': 'bookingId',
	            },
	            ExpressionAttributeValues: {
	                ':bookingIdData': decodedData.bookingId,
	            },
	            ProjectionExpression: 'candidateId,bookingId,testStatus',
	            ScanIndexForward: false
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.query(queryParams, function (err, data) {
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                // check testStatus
	                console.log('testStatus', data);
	                if (data.Items[0].testStatus === 'NotTaken') {
	                    observer.next(false);
	                    observer.complete();
	                    return;
	                }
	            });
	        });
	    };
	    /**
	     * updateBookingAfterStartTest
	     * Hr click on starttest button
	     * @param data
	     */
	    BookingServiceImpl.prototype.updateBookingAfterStartTest = function (data) {
	        console.log('in CandidateServiceImpl update()');
	        console.log("data received " + data.category);
	        console.log("data received " + data.jobPostion);
	        console.log("data received " + data.DOE);
	        console.log("data received " + data.paperType);
	        var documentClient = new DocumentClient();
	        var params = {
	            TableName: 'booking',
	            Key: {
	                bookingId: data.bookingId,
	            },
	            ExpressionAttributeNames: {
	                '#ca': 'category',
	                '#jp': 'jobPostion',
	                '#DOE': 'DOE',
	                '#ts': 'testStatus',
	                '#pt': 'paperType',
	                '#cid': 'candidateId'
	            },
	            ExpressionAttributeValues: {
	                ':ca': data.category,
	                ':jp': data.jobPosition,
	                ':DOE': new Date().getTime(),
	                ':ts': 'progress',
	                ':pt': data.paperType,
	                ':cid': data.candidateId
	            },
	            UpdateExpression: 'SET #ca = :ca,#jp=:jp, #DOE = :DOE, #ts= :ts, #pt =:pt, #cid=:cid',
	            ReturnValues: 'ALL_NEW',
	        };
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.update(params, function (err, result) {
	                if (err) {
	                    console.error(err);
	                    observer.error(err);
	                    return;
	                }
	                console.log("result " + JSON.stringify(result));
	                observer.next(result.Attributes);
	                observer.complete();
	            });
	        });
	    };
	    /**
	     * get the data who are not taken the test.......
	     * data whichcontains last data of previous query
	     */
	    BookingServiceImpl.prototype.getWhoNotTakenTest = function (lastEvaluatedKey) {
	        var queryParams = {
	            TableName: 'booking',
	            IndexName: 'testStatusGSI',
	            KeyConditionExpression: '#testStatus = :v_test',
	            ExpressionAttributeNames: {
	                '#testStatus': 'testStatus'
	            },
	            ExpressionAttributeValues: {
	                ':v_test': 'NotTaken'
	            },
	            Limit: 2,
	            ProjectionExpression: 'candidateId, category,testStatus,bookingId,jobPosition',
	            ScanIndexForward: false
	        };
	        if (lastEvaluatedKey != null) {
	            console.log('-----------------------------with data-----------------------');
	            console.log(' data-------------', lastEvaluatedKey.candidateId);
	            queryParams.ExclusiveStartKey = {
	                bookingId: lastEvaluatedKey.bookingId,
	                testStatus: decodeURIComponent(lastEvaluatedKey.testStatus),
	                candidateId: lastEvaluatedKey.candidateId
	            };
	        }
	        else {
	            console.log('----------------------------without data----------------------');
	        }
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.query(queryParams, function (err, data) {
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    observer.complete();
	                    return;
	                }
	                console.log('LastEvaluatedKey=', data.LastEvaluatedKey);
	                observer.next((data.Items));
	                observer.complete();
	            });
	        });
	    };
	    /**
	     * get candidate information
	     *
	     */
	    BookingServiceImpl.prototype.getAllCandidateInfoWhoNotTakenTest = function (data) {
	        var candidateKey = [];
	        data.forEach(function (item) {
	            var myObj = { 'candidateId': item.candidateId };
	            candidateKey.push(myObj);
	        });
	        console.log('out side');
	        var params = {
	            RequestItems: {
	                'candidate': {
	                    Keys: candidateKey,
	                    ProjectionExpression: 'email,firstName,lastName,candidateId'
	                }
	            }
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.batchGet(params, function (err, data1) {
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                var resultArray = [];
	                // console.log('booking data = ',data);
	                var res = (JSON.parse(JSON.stringify(data1.Responses))).candidate;
	                //  console.log('res = ',res);
	                data.forEach(function (item) {
	                    var newArray = res.filter(function (id) {
	                        return (id.candidateId === item.candidateId);
	                    });
	                    //  console.log('new array', newArray[0]);
	                    //  console.log('item = ',item.candidateId);
	                    // if (newArray != undefined){
	                    var bookinginfo = new booking_1.Booking();
	                    bookinginfo.candidateId = item.candidateId;
	                    bookinginfo.candidateId = item.candidateId;
	                    bookinginfo.testStatus = item.testStatus;
	                    bookinginfo.bookingId = item.bookingId;
	                    bookinginfo.category = item.category;
	                    bookinginfo.fullName = newArray[0].firstName + " " + newArray[0].lastName;
	                    bookinginfo.email = newArray[0].email;
	                    bookinginfo.jobPosition = item.jobPosition;
	                    resultArray.push(bookinginfo);
	                    //  console.log(' result', bookinginfo);
	                    //     }
	                });
	                observer.next(resultArray);
	                observer.complete();
	            });
	        });
	    };
	    /**
	     * get data from uri, decode and send candidate information about test
	     *
	     * test not taken ---- able to take test
	     * progress -----After clicking on start test
	     * test taken ---- after test completed
	     */
	    BookingServiceImpl.prototype.getCandidateHomePageInfo = function (data) {
	        var decodedData = JSON.parse(new Buffer(data.candidateinfo, 'base64').toString('ascii'));
	        var queryParams = {
	            TableName: 'booking',
	            KeyConditionExpression: '#bookingId = :bookingId',
	            ExpressionAttributeNames: {
	                '#bookingId': 'bookingId'
	            },
	            ExpressionAttributeValues: {
	                ':bookingId': decodedData.bookingId
	            },
	            ProjectionExpression: 'candidateId, category,paperType,bookingId,testStatus',
	            ScanIndexForward: false
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.query(queryParams, function (err, result) {
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                if (result.Items.length === 0) {
	                    observer.complete();
	                    return;
	                }
	                // check testStatus
	                console.log('test status', result.Items[0].testStatus);
	                if (data.Items[0].testStatus === 'progress') {
	                    observer.next((result.Items[0]));
	                    observer.complete();
	                    return;
	                }
	                observer.error('contact our HR');
	                return;
	            });
	        });
	    };
	    /**
	     *  checking candidate Token
	     */
	    BookingServiceImpl.prototype.candidateTokenChecking = function (data, pathParameter) {
	        var decodedData = JSON.parse(new Buffer(pathParameter.candidateinfo, 'base64').toString('ascii'));
	        var queryParams = {
	            TableName: 'candidate',
	            KeyConditionExpression: '#candidateId = :candidateId',
	            ExpressionAttributeNames: {
	                '#candidateId': 'candidateId'
	            },
	            ExpressionAttributeValues: {
	                ':candidateId': data.candidateId
	            },
	            ProjectionExpression: 'candidateId, token',
	            ScanIndexForward: false
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.query(queryParams, function (err, data1) {
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                // check token
	                console.log('token data', data1.Items);
	                if (data1.Items[0].token === decodedData.token) {
	                    observer.next((data));
	                    observer.complete();
	                    return;
	                }
	                observer.error('Candidate token miss matched');
	                return 'Candidate token miss matched';
	            });
	        });
	    };
	    /**
	     * ashok
	     */
	    // check Candidate ID exist or not in Booking table
	    BookingServiceImpl.prototype.findByCandidateId = function (candidateId, reqdata) {
	        var _this = this;
	        console.log('in BookingServiceImpl findByCandidateId()');
	        var queryParams = {
	            TableName: 'booking',
	            IndexName: 'candidateIdGSI',
	            ProjectionExpression: 'category,dateofExam,jobPosition,bookingId,testStatus',
	            KeyConditionExpression: '#candidateId = :candidateIdFilter',
	            ExpressionAttributeNames: {
	                '#candidateId': 'candidateId'
	            },
	            ExpressionAttributeValues: {
	                ':candidateIdFilter': candidateId
	            }
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.query(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                /**
	                 *  CandidateId is not exist in the Booking Table consider as a frehser  then book the slot.
	                 */
	                if (data.Items.length === 0) {
	                    console.log(" this candidateID  " + candidateId + " is not Exist in the Booking Table  ");
	                    var token = node_uuid_1.v4();
	                    var bookingId = node_uuid_1.v4();
	                    _this.updateBookingInfo(bookingId, candidateId, token, reqdata.category, reqdata.jobPosition, reqdata.emails, reqdata.emailsubject, reqdata.emailbody)
	                        .then(_this.updateCandidateInfo.bind(_this))
	                        .then(_this.sendEmail.bind(_this))
	                        .then(function () {
	                        var msg = ' Success fully Sending mail';
	                        observer.next(msg);
	                        observer.complete();
	                    }, function (rej) {
	                        console.log('rejected', rej);
	                    });
	                    return;
	                }
	                else {
	                    var cate = reqdata.category;
	                    console.log(cate);
	                    var sortingDatesArray = [];
	                    console.log(data.Items);
	                    for (var i = 0; i < data.Items.length; i++) {
	                        if (cate === data.Items[i].category && data.Items[i].testStatus === 'taken') {
	                            sortingDatesArray.push(data.Items[i].dateofExam);
	                        }
	                    }
	                    if (sortingDatesArray.length === 0) {
	                        var token = node_uuid_1.v4();
	                        var bookingId = node_uuid_1.v4();
	                        _this.updateBookingInfo(bookingId, candidateId, token, reqdata.category, reqdata.jobPosition, reqdata.emails, reqdata.emailsubject, reqdata.emailbody)
	                            .then(_this.updateCandidateInfo.bind(_this))
	                            .then(_this.sendEmail.bind(_this))
	                            .then(function () {
	                            observer.next('Success fully Sending mail');
	                            observer.complete();
	                        }, function (rej) {
	                            console.log('rejected', rej);
	                        });
	                        return;
	                    }
	                    else {
	                        var srtarr = [];
	                        for (var i = 0; i < sortingDatesArray.length; i++) {
	                            var df = sortingDatesArray[i].split('-');
	                            srtarr.push(Date.UTC(df[0], df[1] - 1, df[2]));
	                        }
	                        srtarr.sort();
	                        var oneDay = 24 * 60 * 60 * 1000;
	                        var diffDays = Math.round(Math.abs((new Date(srtarr[0]).getTime() - new Date().getTime()) / (oneDay)));
	                        console.log(diffDays);
	                        // validation of dates
	                        if (30 < diffDays) {
	                            var token = node_uuid_1.v4();
	                            var bookingId = node_uuid_1.v4();
	                            _this.updateBookingInfo(bookingId, candidateId, token, reqdata.category, reqdata.jobPosition, reqdata.emails, reqdata.emailsubject, reqdata.emailbody)
	                                .then(_this.updateCandidateInfo.bind(_this))
	                                .then(_this.sendEmail.bind(_this))
	                                .then(function () {
	                                observer.next(' Success fully Sending mail');
	                                observer.complete();
	                            }, function (rej) {
	                                console.log('rejected', rej);
	                            });
	                        }
	                        else {
	                            // console.log('System does not allow with in 30 Days');
	                            observer.next('System does not allow with in 30 Days');
	                            observer.complete();
	                        }
	                    }
	                }
	            });
	        });
	    };
	    // Before send  a mail: step 2->  Update the tokenid in Candidate table based on CandidateID
	    BookingServiceImpl.prototype.updateCandidateInfo = function (result) {
	        console.log("Update the tokenId :" + result.token + " in candidate table ");
	        var documentClient = new DocumentClient();
	        var params = {
	            TableName: 'candidate',
	            Key: {
	                candidateId: result.candidateId,
	            },
	            ExpressionAttributeNames: {
	                '#tok': 'tokenId'
	            },
	            ExpressionAttributeValues: {
	                ':tok': result.token
	            },
	            UpdateExpression: 'SET #tok=:tok',
	            ReturnValues: 'ALL_NEW',
	        };
	        return new Promise(function (resolve, reject) {
	            documentClient.update(params, function (err, data) {
	                if (err) {
	                    console.error(err);
	                    reject(err);
	                    return;
	                }
	                resolve({ result: result });
	            });
	        });
	    };
	    // Before Sending a mail, Step->1 Update Booking table - bookingid,candidateid,category,jobposition
	    BookingServiceImpl.prototype.updateBookingInfo = function (bookingId, candidateId, token, category, jobPosition, emailids, emailsubject, emailbody) {
	        console.log(' update the information in Booking');
	        console.log("data received CandidateId : " + candidateId);
	        console.log("data received Category :" + category);
	        console.log("data received jobPosition :" + jobPosition);
	        console.log("data received bookingId :" + bookingId);
	        var testStatus = 'notTaken';
	        var documentClient = new DocumentClient();
	        var params = {
	            TableName: 'booking',
	            Key: {
	                bookingId: bookingId,
	            },
	            ExpressionAttributeNames: {
	                '#cid': 'candidateId',
	                '#ct': 'category',
	                '#jp': 'jobPosition',
	                '#ts': 'testStatus'
	            },
	            ExpressionAttributeValues: {
	                ':cid': candidateId,
	                ':ct': category,
	                ':jp': jobPosition,
	                ':ts': testStatus
	            },
	            UpdateExpression: 'SET #cid=:cid,#ct=:ct,#jp=:jp, #ts=:ts',
	            ReturnValues: 'ALL_NEW',
	        };
	        return new Promise(function (resolve, reject) {
	            documentClient.update(params, function (err, data) {
	                if (err) {
	                    console.log(err);
	                    reject('data is not inserted');
	                }
	                else {
	                    console.log('updated booking Information in Booking Table');
	                    resolve({ candidateId: candidateId, token: token, emailids: emailids, emailsubject: emailsubject, emailbody: emailbody });
	                }
	            });
	        });
	    };
	    // send  mail to respective emailid - {email,body,subject}
	    BookingServiceImpl.prototype.sendEmail = function (result) {
	        var mydata = (JSON.parse(JSON.stringify(result)));
	        var emailConfig = {
	            region: ' us-east-1'
	        };
	        var that = this;
	        var emailSES = new aws_sdk_1.SES(emailConfig);
	        var prom = new Promise(function (res, rej) {
	            if (!mydata.result.emailids) {
	                rej('Please provide email');
	                return prom;
	            }
	            var emailParams = that.createEmailParamConfig(mydata.result.emailids, mydata.result.emailsubject, mydata.result.emailbody, result.tokenid);
	            emailSES.sendEmail(emailParams, function (err, data) {
	                if (err) {
	                    console.log(err);
	                    rej("Error in sending out email " + err);
	                    return prom;
	                }
	                res("Successfully sent email to " + mydata.result.emails);
	            });
	        });
	        return prom;
	    };
	    BookingServiceImpl.prototype.createEmailParamConfig = function (email, subject, body, tokenid) {
	        var params = {
	            Destination: {
	                BccAddresses: [],
	                CcAddresses: [],
	                ToAddresses: [email]
	            },
	            Message: {
	                Body: {
	                    Html: {
	                        Data: body,
	                        // this.generateEmailTemplate('ashok@amitisoft.com', tokenid, body),
	                        Charset: 'UTF-8'
	                    }
	                },
	                Subject: {
	                    Data: subject,
	                    Charset: 'UTF-8'
	                }
	            },
	            Source: 'ashok@amitisoft.com',
	            ReplyToAddresses: ['ashok@amitisoft.com'],
	            ReturnPath: 'ashok@amitisoft.com'
	        };
	        return params;
	    };
	    BookingServiceImpl.prototype.generateEmailTemplate = function (emailFrom, tokenid, embody) {
	        console.log('generate email');
	        return "\n         <!DOCTYPE html>\n         <html>\n           <head>\n             <meta charset='UTF-8' />\n             <title>title</title>\n           </head>\n           <body>\n                  \n            <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>\n             <tr>\n                 <td align='center' valign='top'>\n                     <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>\n                         <tr style='background-color:#99ccff;'>\n                             <td align='center' valign='top'>\n                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailBody'>\n                                     <tr>\n                                         <td align='center' valign='top' style='color:#337ab7;'>\n                                             <h3>embody\n                                             <a href='http://mail.amiti.in/verify.html?token=" + tokenid + "'>http://mail.amiti.in/verify.html?token=" + tokenid + "</a>\n                                             </h3>\n                                         </td>\n                                     </tr>\n                                 </table>\n                             </td>\n                         </tr>\n                         <tr style='background-color:#74a9d8;'>\n                             <td align='center' valign='top'>\n                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailReply'>\n                                     <tr style='font-size: 1.2rem'>\n                                         <td align='center' valign='top'>\n                                             <span style='color:#286090; font-weight:bold;'>Send From:</span> <br/> " + emailFrom + "\n                                         </td>\n                                     </tr>\n                                 </table>\n                             </td>\n                         </tr>\n                     </table>\n                 </td>\n             </tr>\n             </table>\n           </body>\n         </html>\n";
	    };
	    return BookingServiceImpl;
	}());
	BookingServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], BookingServiceImpl);
	exports.BookingServiceImpl = BookingServiceImpl;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	"use strict";
	var Booking = (function () {
	    function Booking() {
	    }
	    return Booking;
	}());
	exports.Booking = Booking;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var booking_service_1 = __webpack_require__(20);
	var BookingFacade = (function () {
	    function BookingFacade(bookingService) {
	        this.bookingService = bookingService;
	    }
	    BookingFacade.prototype.updateBookingAfterStartTest = function (data) {
	        return this.bookingService.updateBookingAfterStartTest(data);
	    };
	    BookingFacade.prototype.getWhoNotTakenTest = function (data) {
	        return this.bookingService.getWhoNotTakenTest(data);
	    };
	    BookingFacade.prototype.getAllCandidateInfoWhoNotTakenTest = function (data) {
	        var _this = this;
	        console.log('in BookingFacade getAll()');
	        return this.bookingService.getAllCandidateInfoWhoNotTakenTest(data)
	            .map(function (bookings) {
	            console.log("map = , " + bookings);
	            return {
	                bookings: bookings.map(_this.mapBookingToDto)
	            };
	        });
	    };
	    BookingFacade.prototype.getCandidateHomePageInfo = function (data) {
	        return this.bookingService.getCandidateHomePageInfo(data);
	    };
	    BookingFacade.prototype.candidateTokenChecking = function (data, pathParameter) {
	        return this.bookingService.candidateTokenChecking(data, pathParameter);
	    };
	    /**
	     * Check link  Active or inActive
	     */
	    BookingFacade.prototype.isLinkActive = function (pathParameter) {
	        return this.bookingService.isLinkActive(pathParameter);
	    };
	    BookingFacade.prototype.findByCandidateId = function (candidateId, data) {
	        console.log("in BookingFacade findByCandidateId() " + candidateId);
	        return this.bookingService.findByCandidateId(candidateId, data);
	    };
	    BookingFacade.prototype.mapBookingToDto = function (booking) {
	        console.log("in mapBookingToDto, " + booking);
	        // let formate = {year: 'numeric', month: 'numeric', day: 'numeric'};
	        // let date = new Date(new Date().getUTCDate());
	        return {
	            candidateId: booking.candidateId,
	            category: booking.category,
	            jobPosition: booking.jobPosition,
	            dateOfExam: new Date().toDateString(),
	            testStatus: booking.testStatus,
	            startTime: 5,
	            paperType: '',
	            candidateFullName: booking.fullName,
	            candidateMailId: booking.email,
	            bookingId: booking.bookingId
	        };
	    };
	    return BookingFacade;
	}());
	BookingFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [booking_service_1.BookingServiceImpl])
	], BookingFacade);
	exports.BookingFacade = BookingFacade;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var aws_sdk_1 = __webpack_require__(13);
	var AWS = __webpack_require__(13);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	AWS.config.update({
	    region: ' us-east-1'
	});
	var QsnIdsServiceImpl = (function () {
	    function QsnIdsServiceImpl() {
	        console.log('in QsnIdsServiceImpl constructor()');
	    }
	    QsnIdsServiceImpl.prototype.getQsnId = function (questionPaperId) {
	        console.log('in QsnIdsServiceImpl get()');
	        var queryParams = {
	            TableName: 'questionPaper',
	            ProjectionExpression: 'QsnId',
	            KeyConditionExpression: '#questionPaperId = :questionPaperId',
	            ExpressionAttributeNames: {
	                '#questionPaperId': 'questionPaperId',
	            },
	            ExpressionAttributeValues: {
	                ':questionPaperId': questionPaperId,
	            },
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.query(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    console.log('no data received for get Qsn');
	                    observer.complete();
	                    return;
	                }
	                data.Items.forEach(function (item) {
	                    console.log("Qsn Id " + item.QsnId);
	                });
	                observer.next(data.Items);
	                observer.complete();
	            });
	        });
	    };
	    return QsnIdsServiceImpl;
	}());
	QsnIdsServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], QsnIdsServiceImpl);
	exports.QsnIdsServiceImpl = QsnIdsServiceImpl;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var QsnIds_service_1 = __webpack_require__(23);
	var QsnIdsFacade = (function () {
	    function QsnIdsFacade(qsnIdsService) {
	        this.qsnIdsService = qsnIdsService;
	        console.log('in QsnPaperFacade constructor()');
	    }
	    QsnIdsFacade.prototype.getQsnId = function (questionPaperId) {
	        console.log('in QsnPaperFacade getAll()');
	        return this.qsnIdsService.getQsnId(questionPaperId);
	    };
	    return QsnIdsFacade;
	}());
	QsnIdsFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [QsnIds_service_1.QsnIdsServiceImpl])
	], QsnIdsFacade);
	exports.QsnIdsFacade = QsnIdsFacade;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var aws_sdk_1 = __webpack_require__(13);
	var AWS = __webpack_require__(13);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	AWS.config.update({
	    region: ' us-east-1'
	});
	var QuestionServiceImpl = (function () {
	    function QuestionServiceImpl() {
	        console.log('in QsnPaperServiceImpl constructor()');
	    }
	    QuestionServiceImpl.prototype.getQsn = function (qsnId, category) {
	        console.log('in QsnPaperServiceImpl get()');
	        var queryParams = {
	            TableName: 'question',
	            ProjectionExpression: 'Category,Qsn_id, Qsn, Crct_ans, Option1,Option2, Option3, Option4,Multi_flag',
	            KeyConditionExpression: '#Category = :Category and #QsnId = :QsnId',
	            ExpressionAttributeNames: {
	                '#Category': 'Category',
	                '#QsnId': 'Qsn_id'
	            },
	            ExpressionAttributeValues: {
	                ':Category': category,
	                ':QsnId': qsnId
	            },
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.query(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    console.log('no data received for get Qsn');
	                    observer.complete();
	                    return;
	                }
	                data.Items.forEach(function (item) {
	                    console.log("Category " + item.Category);
	                    console.log("Qsn " + item.Qsn);
	                    console.log("Curct_ans " + item.curct_ans);
	                    console.log("Opt1 " + item.Opt1);
	                });
	                observer.next(data.Items);
	                observer.complete();
	            });
	        });
	    };
	    return QuestionServiceImpl;
	}());
	QuestionServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], QuestionServiceImpl);
	exports.QuestionServiceImpl = QuestionServiceImpl;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var Question_service_1 = __webpack_require__(25);
	var QuestionFacade = (function () {
	    function QuestionFacade(questionService) {
	        this.questionService = questionService;
	        console.log('in QsnPaperFacade constructor()');
	    }
	    QuestionFacade.prototype.getQsn = function (qsnId, category) {
	        console.log('in QsnPaperFacade getAll()', qsnId);
	        console.log('in QsnPaperFacade getAll()', category);
	        return this.questionService.getQsn(qsnId, category);
	    };
	    return QuestionFacade;
	}());
	QuestionFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [Question_service_1.QuestionServiceImpl])
	], QuestionFacade);
	exports.QuestionFacade = QuestionFacade;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var aws_sdk_1 = __webpack_require__(13);
	var AWS = __webpack_require__(13);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	AWS.config.update({
	    region: ' us-east-1'
	});
	var ResultServiceImpl = (function () {
	    function ResultServiceImpl() {
	        console.log('in ResultServiceImpl constructor()');
	    }
	    ResultServiceImpl.prototype.update = function (dataa) {
	        // console.log('data before type of----', typeof dataa);
	        // console.log('data After type of----', typeof dataa);
	        // console.log('in ResultServiceImpl get()');
	        var documentClient = new DocumentClient();
	        var data = dataa;
	        console.log("Data Conversion = " + data);
	        var score;
	        if (data.curct_ans === data.cand_ans)
	            score = 1;
	        else
	            score = 0;
	        var params = {
	            TableName: 'result',
	            Key: {
	                BookingId: data.BookingId,
	                QsnId: data.QsnId
	            },
	            ExpressionAttributeNames: {
	                '#ci': 'CandidateId',
	                '#a': 'curct_ans',
	                '#ca': 'cand_ans',
	                '#s': 'score'
	            },
	            ExpressionAttributeValues: {
	                ':ci': data.CandidateId,
	                ':a': data.curct_ans,
	                ':ca': data.cand_ans,
	                ':s': score
	            },
	            UpdateExpression: 'SET #ci = :ci,  #a=:a , #ca = :ca , #s =:s',
	            ReturnValues: 'ALL_NEW',
	        };
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.update(params, function (err, result) {
	                if (err) {
	                    console.error(err);
	                    observer.error(err);
	                    return;
	                }
	                console.log("result " + JSON.stringify(result));
	                observer.next(result.Attributes);
	                observer.complete();
	            });
	        });
	    };
	    return ResultServiceImpl;
	}());
	ResultServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], ResultServiceImpl);
	exports.ResultServiceImpl = ResultServiceImpl;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var Result_service_1 = __webpack_require__(27);
	var ResultFacade = (function () {
	    function ResultFacade(resultService) {
	        this.resultService = resultService;
	        console.log('in QsnPaperFacade constructor()');
	    }
	    ResultFacade.prototype.update = function (data) {
	        console.log('in QsnPaperFacade getAll()');
	        return this.resultService.update(data);
	    };
	    return ResultFacade;
	}());
	ResultFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [Result_service_1.ResultServiceImpl])
	], ResultFacade);
	exports.ResultFacade = ResultFacade;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var create_question_service_1 = __webpack_require__(30);
	var CreateQuestionFacade = (function () {
	    function CreateQuestionFacade(createQuestionService) {
	        this.createQuestionService = createQuestionService;
	        console.log('in CreateQuestionFacade constructor()');
	    }
	    CreateQuestionFacade.prototype.createQuestion = function (data) {
	        return this.createQuestionService.create(data);
	    };
	    CreateQuestionFacade.prototype.findbyCategory = function (categoryId, lastqsnid) {
	        console.log('in categoryId findBycategoryId()');
	        return this.createQuestionService.findById(categoryId, lastqsnid);
	    };
	    return CreateQuestionFacade;
	}());
	CreateQuestionFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [create_question_service_1.CreateQuestionServiceImpl])
	], CreateQuestionFacade);
	exports.CreateQuestionFacade = CreateQuestionFacade;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var aws_sdk_1 = __webpack_require__(13);
	var AWS = __webpack_require__(13);
	var uuid = __webpack_require__(31);
	console.log('uuuuuuuuuuuuuuuuu', uuid);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	AWS.config.update({
	    region: ' us-east-1'
	});
	var CreateQuestionServiceImpl = (function () {
	    function CreateQuestionServiceImpl() {
	        console.log('in CreateQuestionServiceImpl constructor()');
	    }
	    CreateQuestionServiceImpl.prototype.create = function (data) {
	        console.log('in CreateQuestionServiceImpl create()', typeof data);
	        var documentClient = new DocumentClient();
	        var params = {};
	        var uuidd = uuid.v4();
	        if (typeof data == 'string') {
	            data = JSON.parse(data);
	            params = {
	                TableName: 'question',
	                Item: {
	                    Qsn_id: uuidd,
	                    Qsn: data['Qsn'],
	                    Category: data['Category'],
	                    Option1: data['Option1'],
	                    Option2: data['Option2'],
	                    Option3: data['Option3'],
	                    Option4: data['Option4'],
	                    Crct_ans: data['Crct_ans'],
	                    Multi_flag: true,
	                    Date: new Date().toJSON().slice(0, 10).replace(/-/g, '/')
	                }
	            };
	        }
	        else {
	            params = {
	                TableName: 'question',
	                Item: {
	                    Qsn_id: uuidd,
	                    Qsn: data['Qsn'],
	                    Category: data['Category'],
	                    Option1: data['Option1'],
	                    Option2: data['Option2'],
	                    Option3: data['Option3'],
	                    Option4: data['Option4'],
	                    Crct_ans: data['Crct_ans'],
	                    Multi_flag: true,
	                    Date: new Date().toJSON().slice(0, 10).replace(/-/g, '/')
	                }
	            };
	        }
	        console.log('parammmmmmmmmmmmmmmmmmmm00000000000000------------', data['Qsn']);
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('param------------', params);
	            documentClient.put(params, function (err, data) {
	                console.log('eeeeeeeeeeeeee', err);
	                if (err) {
	                    console.log('ifffffffffffffffffffffff');
	                    if (err.code === 'ConditionalCheckFailedException') {
	                        observer.error(err);
	                        return;
	                    }
	                }
	                data = 'success';
	                // console.log(data.Item[0]);
	                observer.next(data);
	                observer.complete();
	            });
	        });
	    };
	    CreateQuestionServiceImpl.prototype.findById = function (categoryId, lastqsnid) {
	        console.log('in CreateQuestionServiceImpl find()');
	        var queryParams = {
	            TableName: 'question',
	            ProjectionExpression: 'Category, Qsn_id, Qsn,Date',
	            KeyConditionExpression: '#Category = :categoryIdFilter',
	            ExpressionAttributeNames: {
	                '#Category': 'Category'
	            },
	            ExpressionAttributeValues: {
	                ':categoryIdFilter': categoryId
	            },
	            Limit: 2
	        };
	        console.log(lastqsnid);
	        if (lastqsnid != 'null') {
	            console.log('-----------------------------with data-----------------------');
	            console.log(' data-------------', lastqsnid);
	            queryParams.ExclusiveStartKey = { Qsn_id: lastqsnid, Category: categoryId };
	        }
	        else {
	            console.log('----------------------------without data----------------------');
	        }
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            console.log('Executing query with parameters ' + queryParams);
	            documentClient.query(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log("data items receieved " + data.Items.length);
	                if (data.Items.length === 0) {
	                    console.log('no data received for this category');
	                    observer.complete();
	                    return;
	                }
	                // console.log('lllllllllllllll',data);
	                data.Items.forEach(function (item) {
	                    console.log('candidate Id item', item);
	                    // console.log(`candidate firstName ${item.firstName}`);
	                    // console.log(`candidate lastName ${item.lastName}`);
	                    // console.log(`candidate email ${item.email}`);
	                });
	                //console.log(data.Items);
	                observer.next(data.Items);
	                observer.complete();
	            });
	        });
	    };
	    return CreateQuestionServiceImpl;
	}());
	CreateQuestionServiceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], CreateQuestionServiceImpl);
	exports.CreateQuestionServiceImpl = CreateQuestionServiceImpl;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = require("uuid");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var create_question_paper_service_1 = __webpack_require__(33);
	var CreateQuestionPaperFacade = (function () {
	    function CreateQuestionPaperFacade(createQuestionPaperservice) {
	        this.createQuestionPaperservice = createQuestionPaperservice;
	        console.log('in CreateQuestionFacade constructor()');
	    }
	    CreateQuestionPaperFacade.prototype.createQuestionPaper = function (qsns, qsnPaperName) {
	        console.log('qsnPaperName........', qsnPaperName);
	        return this.createQuestionPaperservice.createQuestionPaper(qsns, qsnPaperName);
	    };
	    CreateQuestionPaperFacade.prototype.getQuestionPapers = function () {
	        console.log('in categoryId getQuestionPapers()');
	        return this.createQuestionPaperservice.getAllQuestionPaperNames();
	    };
	    return CreateQuestionPaperFacade;
	}());
	CreateQuestionPaperFacade = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [create_question_paper_service_1.CreateQuestionPaperserviceImpl])
	], CreateQuestionPaperFacade);
	exports.CreateQuestionPaperFacade = CreateQuestionPaperFacade;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var aws_sdk_1 = __webpack_require__(13);
	var node_uuid_1 = __webpack_require__(12);
	var AWS = __webpack_require__(13);
	var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
	AWS.config.update({
	    region: ' us-east-1'
	});
	var CreateQuestionPaperserviceImpl = (function () {
	    function CreateQuestionPaperserviceImpl() {
	        console.log('in createQuestionPaperserviceImpl constructor()');
	    }
	    CreateQuestionPaperserviceImpl.prototype.createQuestionPaper = function (data, qsnPaperName) {
	        var documentClient = new DocumentClient();
	        console.log('qsnPaperName[[[[[[[[[[[[[[[', qsnPaperName);
	        var qsnppr = [];
	        var params = {};
	        var uuid = node_uuid_1.v4();
	        var qsnPaperNames = {
	            TableName: 'questionPaperNames',
	            Item: {
	                QsnPaper_id: uuid,
	                Qsn_Paper_name: qsnPaperName,
	            }
	        };
	        if (typeof data === 'string') {
	            data = JSON.parse(data);
	            for (var item = 0; item < data.length; item++) {
	                var myObj = {
	                    PutRequest: {
	                        Item: {
	                            'questionPaperId': uuid,
	                            'Qsn_Id': data[item].questionId,
	                            'Category': data[item].Category
	                        }
	                    }
	                };
	                qsnppr.push(myObj);
	            }
	            params = {
	                RequestItems: {
	                    'questionPaper': qsnppr
	                }
	            };
	        }
	        else {
	            for (var item = 0; item < data.length; item++) {
	                var myObj = {
	                    PutRequest: {
	                        Item: {
	                            'questionPaperId': uuid,
	                            'QsnId': data[item].questionId,
	                            'Category': data[item].Category
	                        }
	                    }
	                };
	                qsnppr.push(myObj);
	            }
	            params = {
	                RequestItems: {
	                    'questionPaper': qsnppr
	                }
	            };
	        }
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.put(qsnPaperNames, function (err, result) {
	                if (err) {
	                    observer.error(err);
	                    return;
	                }
	                data = 'success';
	                observer.next(result);
	                // observer.complete();
	            });
	            documentClient.batchWrite(params, function (err, result) {
	                if (err) {
	                    observer.error(err);
	                    return;
	                }
	                result = 'success';
	                observer.next(result);
	                observer.complete();
	            });
	        });
	    };
	    CreateQuestionPaperserviceImpl.prototype.getAllQuestionPaperNames = function () {
	        console.log('in getAllQuestionPaperNames find()');
	        var queryParams = {
	            TableName: 'questionPaperNames',
	            ProjectionExpression: 'Qsn_Paper_name,QsnPaper_id',
	        };
	        var documentClient = new DocumentClient();
	        return rxjs_1.Observable.create(function (observer) {
	            documentClient.scan(queryParams, function (err, data) {
	                console.log("did we get error " + err);
	                if (err) {
	                    observer.error(err);
	                    throw err;
	                }
	                console.log('data...', data);
	                if (data.Items.length === 0) {
	                    console.log('no data received for this category');
	                    observer.complete();
	                    return;
	                }
	                // data.Items.forEach((item) => {
	                //     //console.log(`candidate Id ${item.Qsn_Paper_name}`);
	                //     //console.log(`candidate firstName ${item.QsnPaper_id}`);
	                // });
	                // console.log(data.Items);
	                observer.next(data.Items);
	                observer.complete();
	            });
	        });
	    };
	    return CreateQuestionPaperserviceImpl;
	}());
	CreateQuestionPaperserviceImpl = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], CreateQuestionPaperserviceImpl);
	exports.CreateQuestionPaperserviceImpl = CreateQuestionPaperserviceImpl;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(4);
	var http_context_impl_1 = __webpack_require__(35);
	var ExecutionContextImpl = (function () {
	    function ExecutionContextImpl() {
	    }
	    ExecutionContextImpl.createHttpHandler = function (providers, handler) {
	        return function (lambdaEvent, lambdaContext, lambdaCallback) {
	            var httpContext = new http_context_impl_1.HttpContextImpl(lambdaEvent, lambdaCallback);
	            try {
	                var handlerProviders = [
	                    { provide: http_context_impl_1.HttpContextImpl, useValue: httpContext }
	                ].concat(providers);
	                var injector = core_1.ReflectiveInjector.resolveAndCreate(handlerProviders);
	                handler(httpContext, injector);
	            }
	            catch (e) {
	                console.error(e);
	                httpContext.fail(e, 500);
	            }
	        };
	    };
	    return ExecutionContextImpl;
	}());
	exports.ExecutionContextImpl = ExecutionContextImpl;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";
	var HttpContextImpl = (function () {
	    function HttpContextImpl(lambdaEvent, lambdaCallback) {
	        this.lambdaEvent = lambdaEvent;
	        this.lambdaCallback = lambdaCallback;
	    }
	    HttpContextImpl.prototype.ok = function (httpCode, response) {
	        if (httpCode === void 0) { httpCode = 200; }
	        var result = {
	            statusCode: httpCode,
	            headers: {
	                'Access-Control-Allow-Origin': '*',
	                'Access-Control-Allow-Methods': '*',
	                'Access-Control-Allow-Headers': '*'
	            },
	            body: null
	        };
	        if (response) {
	            console.log("in http ok with response " + response);
	            console.log("in http ok with result.body " + result.body);
	            result.body = JSON.stringify(response);
	        }
	        else {
	            result.body = 'Successfully processed request';
	        }
	        this.lambdaCallback(null, result);
	    };
	    HttpContextImpl.prototype.fail = function (error, httpCode, response) {
	        if (httpCode === void 0) { httpCode = 500; }
	        var result = {
	            statusCode: httpCode,
	            headers: {},
	            body: null
	        };
	        if (response) {
	            result.body = JSON.stringify(response);
	        }
	        else {
	            result.body = 'Failed to process request';
	        }
	        this.lambdaCallback(error, result);
	    };
	    HttpContextImpl.prototype.getPathParameters = function () {
	        return this.lambdaEvent.pathParameters;
	    };
	    HttpContextImpl.prototype.getRequestBody = function () {
	        if (typeof this.lambdaEvent.body === 'string') {
	            this.lambdaEvent.body = JSON.parse(this.lambdaEvent.body);
	        }
	        return this.lambdaEvent.body;
	    };
	    HttpContextImpl.prototype.getQueryStringParameters = function () {
	        return this.lambdaEvent.queryStringParameters;
	    };
	    HttpContextImpl.prototype.getHttpMethod = function () {
	        return this.lambdaEvent.httpMethod;
	    };
	    HttpContextImpl.prototype.getRequestContext = function () {
	        return this.lambdaEvent.requestContext;
	    };
	    return HttpContextImpl;
	}());
	exports.HttpContextImpl = HttpContextImpl;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(4);
	var stream_context_impl_1 = __webpack_require__(37);
	var stream_record_impl_1 = __webpack_require__(38);
	var Observable_1 = __webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	var StreamExecutionContextImpl = (function () {
	    function StreamExecutionContextImpl() {
	    }
	    StreamExecutionContextImpl.createMergedStreamHandler = function (providers, handler) {
	        return function (lambdaEvent, lambdaContext, lambdaCallback) {
	            try {
	                var streamContext_1 = null;
	                var streamRecords = lambdaEvent.Records.map(function (record) { return new stream_record_impl_1.StreamRecordImpl(record); });
	                Observable_1.Observable.from(streamRecords)
	                    .mergeMap(function (record) { return Observable_1.Observable.create(function (observer) {
	                    streamContext_1 = new stream_context_impl_1.StreamContextImpl(record, observer);
	                    try {
	                        var handlerProviders = [
	                            { provide: stream_context_impl_1.StreamContextImpl, useValue: streamContext_1 }
	                        ].concat(providers);
	                        var streamInjector = core_1.ReflectiveInjector.resolveAndCreate(handlerProviders);
	                        handler(streamContext_1, streamInjector);
	                    }
	                    catch (e) {
	                        streamContext_1.fail(e);
	                    }
	                }); })
	                    .subscribe(function (next) {
	                    lambdaCallback(null, next);
	                }, function (err) {
	                    console.log(err);
	                }, function () {
	                    lambdaCallback(null, 'Sucessfully Finished!!!');
	                });
	            }
	            catch (e) {
	                console.error(e);
	            }
	        };
	    };
	    StreamExecutionContextImpl.createSerializedStreamHandler = function (providers, handler) {
	        return function (lambdaEvent, lambdaContext, lambdaCallback) {
	            try {
	                var streamContext_2 = null;
	                var streamRecords = lambdaEvent.Records.map(function (record) { return new stream_record_impl_1.StreamRecordImpl(record); });
	                Observable_1.Observable.from(streamRecords)
	                    .concatMap(function (record) { return Observable_1.Observable.create(function (observer) {
	                    streamContext_2 = new stream_context_impl_1.StreamContextImpl(record, observer);
	                    try {
	                        var handlerProviders = [
	                            { provide: stream_context_impl_1.StreamContextImpl, useValue: streamContext_2 }
	                        ].concat(providers);
	                        var streamInjector = core_1.ReflectiveInjector.resolveAndCreate(handlerProviders);
	                        handler(streamContext_2, streamInjector);
	                    }
	                    catch (e) {
	                        streamContext_2.fail(e);
	                    }
	                }); })
	                    .subscribe(function (next) {
	                    lambdaCallback(null, next);
	                }, function (err) {
	                    console.log(err);
	                }, function () {
	                    lambdaCallback(null, 'Successfully Finished!!!');
	                });
	            }
	            catch (e) {
	                console.error(e);
	            }
	        };
	    };
	    return StreamExecutionContextImpl;
	}());
	exports.StreamExecutionContextImpl = StreamExecutionContextImpl;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	"use strict";
	var StreamContextImpl = (function () {
	    function StreamContextImpl(streamRecord, observer) {
	        this.streamRecord = streamRecord;
	        this.observer = observer;
	    }
	    StreamContextImpl.prototype.getRecord = function () {
	        return this.streamRecord;
	    };
	    StreamContextImpl.prototype.ok = function () {
	        console.log("payload received " + JSON.stringify(this.getRecord().getPayload()));
	        this.observer.next(this.getRecord());
	        this.observer.complete();
	    };
	    StreamContextImpl.prototype.fail = function (error) {
	        this.observer.error(error);
	    };
	    return StreamContextImpl;
	}());
	exports.StreamContextImpl = StreamContextImpl;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";
	var StreamRecordImpl = (function () {
	    function StreamRecordImpl(record) {
	        this.record = record;
	    }
	    StreamRecordImpl.prototype.getPayload = function () {
	        var encodedPayload = this.record.kinesis.data;
	        return JSON.parse(new Buffer(encodedPayload, 'base64').toString('ascii'));
	    };
	    StreamRecordImpl.prototype.getSequenceNumber = function () {
	        return this.record.kinesis.sequenceNumber;
	    };
	    StreamRecordImpl.prototype.getPartitionKey = function () {
	        return this.record.kinesis.partitionKey;
	    };
	    return StreamRecordImpl;
	}());
	exports.StreamRecordImpl = StreamRecordImpl;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var candidate_facade_1 = __webpack_require__(19);
	var booking_facade_1 = __webpack_require__(22);
	var GetCandidateHandler = (function () {
	    function GetCandidateHandler() {
	    }
	    GetCandidateHandler.processRegistrationStream = function (streamContext, injector) {
	        console.log("record in processRegistrationStream: " + JSON.stringify(streamContext.getRecord()));
	        console.log("partition key in processRegistrationStream: " + JSON.stringify(streamContext.getRecord().getPartitionKey()));
	        console.log("payload in processRegistrationStream: " + JSON.stringify(streamContext.getRecord().getPayload()));
	        if (streamContext.getRecord().getPayload() !== null) {
	            injector.get(candidate_facade_1.CandidateFacade).registerCandidate(streamContext.getRecord().getPayload());
	        }
	    };
	    GetCandidateHandler.registerCandidatesAndEmailPostRegistration = function (httpContext, injector) {
	        var requestBody = httpContext.getRequestBody();
	        console.log("request body received " + JSON.stringify(requestBody));
	        console.log("input in register candidate " + JSON.stringify(requestBody));
	        injector.get(candidate_facade_1.CandidateFacade).registerCandidatesAndEmailPostRegistration(requestBody)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    GetCandidateHandler.registerCandidate = function (httpContext, injector) {
	        var requestBody = httpContext.getRequestBody();
	        console.log("request body received " + JSON.stringify(requestBody));
	        console.log("input in register candidate " + JSON.stringify(requestBody));
	        injector.get(candidate_facade_1.CandidateFacade).registerCandidate(requestBody);
	    };
	    GetCandidateHandler.getAllCandidates = function (httpContext, injector) {
	        injector.get(candidate_facade_1.CandidateFacade).getAll()
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    GetCandidateHandler.findCandidateById = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        var candidateId = pathParameters.id;
	        injector.get(candidate_facade_1.CandidateFacade).findById(candidateId)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    GetCandidateHandler.startTestDashboard = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        injector.get(booking_facade_1.BookingFacade).getWhoNotTakenTest(pathParameters)
	            .subscribe(function (result) {
	            console.log('myresult = ', result);
	            injector.get(booking_facade_1.BookingFacade).getAllCandidateInfoWhoNotTakenTest(result)
	                .subscribe(function (result1) {
	                console.log('myresult = ', result1);
	                httpContext.ok(200, result1);
	            });
	            //  httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    GetCandidateHandler.getCandidateHomePageInfo = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        injector.get(booking_facade_1.BookingFacade).getCandidateHomePageInfo(pathParameters)
	            .subscribe(function (result) {
	            console.log('myresult = ', result);
	            injector.get(booking_facade_1.BookingFacade).candidateTokenChecking(result, pathParameters)
	                .subscribe(function (result1) {
	                console.log('myresult = ', result1);
	                httpContext.ok(200, result1);
	            });
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    GetCandidateHandler.updateBookingAfterStartTest = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        var data = httpContext.getRequestBody();
	        console.log('pathParameters = ', data);
	        injector.get(booking_facade_1.BookingFacade).updateBookingAfterStartTest(data)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return GetCandidateHandler;
	}());
	exports.GetCandidateHandler = GetCandidateHandler;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var Question_facade_1 = __webpack_require__(26);
	var QsnIds_facade_1 = __webpack_require__(24);
	var GetQsnHandler = (function () {
	    function GetQsnHandler() {
	    }
	    GetQsnHandler.getQsn = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        // let dataFromUI = httpContext.getRequestBody();
	        var data = httpContext.getRequestBody();
	        injector.get(QsnIds_facade_1.QsnIdsFacade).getQsnId(pathParameters['Qsn_Ppr_Id'])
	            .subscribe(function (result) {
	            // httpContext.ok(200, result);
	            console.log("result= " + result[0].questionId);
	            injector.get(Question_facade_1.QuestionFacade).getQsn(result[pathParameters['QsnNo']].questionId, pathParameters['Category'])
	                .subscribe(function (result1) {
	                console.log("Qsn = " + result1);
	                httpContext.ok(200, result1);
	            });
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return GetQsnHandler;
	}());
	exports.GetQsnHandler = GetQsnHandler;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var Result_facade_1 = __webpack_require__(28);
	var UpdateResultHandler = (function () {
	    function UpdateResultHandler() {
	    }
	    UpdateResultHandler.updateResult = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        var data = httpContext.getRequestBody();
	        console.log("data = , " + data);
	        injector.get(Result_facade_1.ResultFacade).update(data)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return UpdateResultHandler;
	}());
	exports.UpdateResultHandler = UpdateResultHandler;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var create_question_facade_1 = __webpack_require__(29);
	var CreateQuestionHandler = (function () {
	    function CreateQuestionHandler() {
	    }
	    CreateQuestionHandler.createQuestion = function (httpContext, injector) {
	        console.log('CreateQuestionHandler');
	        var body = httpContext.getRequestBody();
	        console.log('pathParameters-----', body);
	        injector.get(create_question_facade_1.CreateQuestionFacade).createQuestion(body)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    CreateQuestionHandler.getQuestionByCategory = function (httpContext, injector) {
	        var pathParam = httpContext.getPathParameters();
	        console.log('pathParameters-----??????????', pathParam);
	        var categoryId = pathParam['Category'];
	        var lastqsnid = pathParam['LastqsnId'];
	        console.log('lastqsnid......', lastqsnid);
	        injector.get(create_question_facade_1.CreateQuestionFacade).findbyCategory(categoryId, lastqsnid)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return CreateQuestionHandler;
	}());
	exports.CreateQuestionHandler = CreateQuestionHandler;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var create_question_paper_facade_1 = __webpack_require__(32);
	var QuestionPaperHandler = (function () {
	    function QuestionPaperHandler() {
	    }
	    QuestionPaperHandler.createQuestionPaper = function (httpContext, injector) {
	        var body = httpContext.getRequestBody();
	        var qsns = body.qsns;
	        var qsnPaperName = body.papername;
	        injector.get(create_question_paper_facade_1.CreateQuestionPaperFacade).createQuestionPaper(qsns, qsnPaperName)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    QuestionPaperHandler.getQuestionPaperNames = function (httpContext, injector) {
	        injector.get(create_question_paper_facade_1.CreateQuestionPaperFacade).getQuestionPapers()
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return QuestionPaperHandler;
	}());
	exports.QuestionPaperHandler = QuestionPaperHandler;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var candidate_facade_1 = __webpack_require__(19);
	var booking_facade_1 = __webpack_require__(22);
	// import { UtilHelper } from '../../api/util/util-helper';
	var TestLinkHandler = (function () {
	    function TestLinkHandler() {
	    }
	    TestLinkHandler.findCandidateByEmailId = function (httpContext, injector) {
	        var data = httpContext.getRequestBody();
	        // const findCandidateResult = UtilHelper.waterfall([
	        //     function () {
	        //         return injector.get(CandidateFacade).findCandidateByEmailId(data);
	        //     },
	        //     function (candidate) {
	        //         return injector.get(BookingFacade).findByCandidateId(candidate.candidateId, data);
	        //     }
	        // ]);
	        //
	        // findCandidateResult.subscribe(
	        //     function (x) {
	        //         console.log(`findCandidateResult result ${JSON.stringify(x)}`);
	        //         httpContext.ok(200, x);
	        //     },
	        //     function (err) {
	        //         console.log(`findCandidateResult failed ${err.stack}`);
	        //         httpContext.fail(err, 500);
	        //     }
	        // );
	        injector.get(candidate_facade_1.CandidateFacade).findCandidateByEmailId(data)
	            .subscribe(function (result) {
	            injector.get(booking_facade_1.BookingFacade).findByCandidateId(JSON.parse(JSON.stringify(result)).candidateId, data)
	                .subscribe(function (result1) {
	                httpContext.ok(200, result1);
	            }, function (err) {
	                httpContext.fail(err, 500);
	            });
	        });
	    };
	    return TestLinkHandler;
	}());
	exports.TestLinkHandler = TestLinkHandler;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var booking_facade_1 = __webpack_require__(22);
	var GetBookingHandler = (function () {
	    function GetBookingHandler() {
	    }
	    GetBookingHandler.isActiveLink = function (httpContext, injector) {
	        var pathParameters = httpContext.getPathParameters();
	        console.log(JSON.stringify(pathParameters));
	        injector.get(booking_facade_1.BookingFacade).isLinkActive(pathParameters)
	            .subscribe(function (result) {
	            httpContext.ok(200, result);
	        }, function (err) {
	            httpContext.fail(err, 500);
	        });
	    };
	    return GetBookingHandler;
	}());
	exports.GetBookingHandler = GetBookingHandler;


/***/ })
/******/ ]);