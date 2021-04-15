"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorRegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var models_1 = require("../../../models");
var services_1 = require("../../../services");
var ng2_file_upload_1 = require("ng2-file-upload");
var service_helper_1 = require("../../../helpers/service.helper");
var ngx_toastr_1 = require("ngx-toastr");
var platform_browser_1 = require("@angular/platform-browser");
var $ = require("jquery");
var calender_component_1 = require("../../calender/calender.component");
var subject_studylevel_create_dialog_component_1 = require("../../subject-studylevel-setup/subject-studylevel-create-dialog/subject-studylevel-create-dialog.component");
var dialog_1 = require("@angular/material/dialog");
//import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
var angular_cropperjs_1 = require("angular-cropperjs");
//Same component used for:
//1. Tutor direct registration (with StripePlanId)
//2. Tutor register on Company Invite (with CompanyId)
var TutorRegisterComponent = /** @class */ (function () {
    function TutorRegisterComponent(dialog, fb, toastr, tutorsService, enumsService, stripeService, stripePlansService, tutorQualificationsService, tutorCertificatesService, tutorSubjectsService, subjectsService, subjectCategoriesService, studyLevelsService, sanitizer, companyService, stripeCountrysService) {
        this.dialog = dialog;
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.enumsService = enumsService;
        this.stripeService = stripeService;
        this.stripePlansService = stripePlansService;
        this.tutorQualificationsService = tutorQualificationsService;
        this.tutorCertificatesService = tutorCertificatesService;
        this.tutorSubjectsService = tutorSubjectsService;
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.sanitizer = sanitizer;
        this.companyService = companyService;
        this.stripeCountrysService = stripeCountrysService;
        this.serviceHelper = new service_helper_1.ServiceHelper();
        this.stripePlanId = stripePlanId || null;
        this.companyId = companyId || null;
        this.currentCompany = new models_1.Company();
        this.stripeCountryId = '0: 87017cf8-e86a-4a98-191b-08d7e6c57416';
        this.tutorId = undefined;
        this.tutorFirstName = '';
        this.tutorInitialRegistrationStep = 0;
        this.isRegistrationDone = false;
        this.tutorStoreProfileImageDownload = '';
        this.ownerEntityType = 'Tutor';
        this.step = models_1.RegistrationStep.BasicInfo;
        this.journeyType = models_1.RegistrationJourneyType.TutorRegistration;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.userTitles = [];
        this.stripeCountrys = [];
        this.basicInfoFormSubmitted = false;
        this.paymentFormSubmitted = false;
        this.bankDetailsFormSubmitted = false;
        this.showStripeError = false;
        this.stripeError = null;
        this.coupon = null;
        this.promoCodeChecked = false;
        this.promoCodeInvalid = false;
        this.validatedPromoCode = null;
        this.dbsCheckFormSubmitted = false;
        this.profileFormSubStep = 1;
        this.profileOneFormSubmitted = false;
        this.profileTwoFormSubmitted = false;
        this.profileThreeUploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + '/api/tutors/profileUpload', method: 'POST' });
        this.profileThreeDropZoneOver = false;
        this.profileThreeUploaderShow = true;
        this.qualificationFormSubStep = 1;
        this.qualificationFormSubmitted = false;
        this.tutorQualifications = [];
        this.qualificationFormUploader = new ng2_file_upload_1.FileUploader({ allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'], url: this.serviceHelper.baseApi + '/api/tutorCertificates/upload', method: 'POST' });
        this.qualificationFormDropZoneOver = false;
        this.qualificationFormUploaderShow = true;
        this.tutorCertificates = [];
        this.subjectFormSubmitted = false;
        this.tutorSubjects = [];
        this.subjects = [];
        this.subjectCategorys = [];
        this.journeyTypeForTutor = false;
        this.dbsCheckAllowedInSubscriptoin = true;
        this.stripeCountrys = [];
        this.editSlot = true;
        this.skipType = false;
        this.supportedFileTypes = ['image/png', 'image/jpeg'];
        this.imageChangedEvent = '';
        this.config = {
            aspectRatio: 16 / 16,
            dragMode: 'move',
            background: true,
            movable: true,
            rotatable: true,
            scalable: true,
            zoomable: true,
            viewMode: 1,
            checkImageOrigin: true,
            cropmove: this.cropMoved.bind(this),
            ready: this.cropMoved.bind(this),
            checkCrossOrigin: true
        };
    }
    Object.defineProperty(TutorRegisterComponent.prototype, "registerStep", {
        get: function () { return models_1.RegistrationStep; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TutorRegisterComponent.prototype, "registrationJourneyType", {
        get: function () { return models_1.RegistrationJourneyType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TutorRegisterComponent.prototype, "basicInfoFormControls", {
        get: function () { return this.basicInfoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "bankDetailsFormControls", {
        get: function () { return this.bankDetailsForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "dbsCheckFormControls", {
        get: function () { return this.dbsCheckForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "profileOneFormControls", {
        get: function () { return this.profileOneForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "profileTwoFormControls", {
        get: function () { return this.profileTwoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "qualificationFormControls", {
        get: function () { return this.qualificationForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "subjectFormControls", {
        get: function () { return this.subjectForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorRegisterComponent.prototype, "tutorSubjectStudyLevelsFormArrayControls", {
        get: function () { return this.subjectForm.get('tutorSubjectStudyLevels'); },
        enumerable: false,
        configurable: true
    });
    TutorRegisterComponent.prototype.onResize = function (event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.fc-today-button').addClass('col-12');
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.screenSize >= 1300) {
            $('.mfs').css('display', 'none');
            // $('.fc-today-button').addClass('col-12');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            // $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
    };
    TutorRegisterComponent.prototype.getScreenSize = function (event) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        //console.log(this.scrHeight, this.scrWidth);
        if (this.scrWidth <= 1025) {
            setTimeout(function () {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 1000);
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.scrWidth >= 1350) {
            setTimeout(function () {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300);
        }
        if (this.scrWidth <= 768) {
            setTimeout(function () {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300);
        }
        else {
            setTimeout(function () {
                $('.fc-today-button').removeClass('col-12');
            }, 300);
        }
    };
    TutorRegisterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getScreenSize();
        //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
        //    this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
        //    this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
        //}, err => {
        //})
        this.stripeCountrysService.get()
            .subscribe(function (countrySuccess) {
            _this.stripeCountrys = countrySuccess;
        });
        //this.getSubscription();
        if (this.journeyType == models_1.RegistrationJourneyType.TutorRegistration) {
            this.journeyTypeForTutor = true;
        }
        this.setupJourneyType();
        this.getStripePlanDetails(this.stripePlanId);
        this.getCompanyDetails(this.companyId);
        this.tutorsService.getMy()
            .subscribe(function (success) {
            if (success != null) {
                _this.tutorId = success.tutorId;
                _this.tutorFirstName = success.userFirstName;
                _this.tutorInitialRegistrationStep = success.initialRegistrationStep;
                _this.currentCompany = success.currentCompany;
                _this.preventJoiningAnotherCompany();
                if (success.initialRegistrationStep > 0) {
                    _this.navigate(success.initialRegistrationStep);
                }
                else {
                    _this.navigate(_this.step);
                }
            }
            else {
                _this.navigate(_this.step);
            }
        }, function (error) {
        });
    };
    TutorRegisterComponent.prototype.setupJourneyType = function () {
        if (this.stripePlanId != null && this.companyId == null) {
            this.journeyType = models_1.RegistrationJourneyType.TutorRegistration;
            this.isFilterVisible = 2;
        }
        else {
            this.journeyType = models_1.RegistrationJourneyType.TutorJoiningCompany;
            this.isFilterVisible = 3;
        }
    };
    TutorRegisterComponent.prototype.getCompanyDetails = function (companyId) {
        var _this = this;
        if (companyId == null)
            return; // Skip this if not given.
        this.companyService.getById(companyId)
            .subscribe(function (success) {
            debugger;
            $('.loading').hide();
            console.log("Company details:", companyId, success);
            _this.company = success;
            _this.company.companyName = _this.company.companyName.toLocaleUpperCase();
            _this.stripeCountryId = _this.company.stripeCountryID;
        }, function (error) {
        });
    };
    TutorRegisterComponent.prototype.navigate = function (step) {
        var _this = this;
        if (this.skipType) {
            $('.loading').css('background-color', '#fff');
        }
        $('.loading').show();
        this.step = step;
        this.tutorsService.updateInitialRegisterStep(this.step)
            .subscribe(function (success) {
            if (success != null) {
                _this.tutorInitialRegistrationStep = success.initialRegistrationStep;
                _this.isRegistrationDone = success.initialRegistrationComplete;
            }
        }, function (error) {
            _this.toastr.error("Error occurred. Please refresh page and retry.");
            console.log(error);
        });
        if (this.step == models_1.RegistrationStep.BasicInfo) {
            this.moveToStep('dvbasicInfo');
            this.enumsService.get('UserTitle')
                .subscribe(function (success) {
                _this.userTitles = success;
            }, function (error) {
            });
            this.tutorsService.getBasicInfo()
                .subscribe(function (success) {
                debugger;
                _this.currentCompany = success.currentCompany; // can be null..
                _this.preventJoiningAnotherCompany();
                _this.basicInfoFormSubmitted = false;
                _this.basicInfoForm = _this.fb.group({
                    userId: [success.userId],
                    title: [success.title, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                    stripeCountryId: [_this.stripeCountryId, [forms_1.Validators.required]],
                    firstName: [success.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                    lastName: [success.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                    telephoneNumber: [success.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    email: [{ value: success.email, disabled: true }],
                    dateOfBirthDay: [success.dateOfBirthDay, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
                    dateOfBirthMonth: [success.dateOfBirthMonth, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
                    dateOfBirthYear: [success.dateOfBirthYear, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.minLength(4), forms_1.Validators.maxLength(4)]],
                    mobileNumber: [success.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    termsAndConditionsAccepted: [Boolean(success.termsAndConditionsAccepted), [forms_1.Validators.required]],
                    marketingAccepted: [success.marketingAccepted, []],
                    //wizcraft
                    platFormUse: ['3'],
                });
                $('.loading').hide();
            }, function (error) {
            });
        }
        else if (this.step == models_1.RegistrationStep.Payment) {
            this.setupPaymentsPage();
            $('.loading').hide();
        }
        else if (this.step == models_1.RegistrationStep.PaymentApproved) {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                if (success != null) {
                    _this.tutorId = success.tutorId;
                    _this.tutorFirstName = success.userFirstName;
                    $('.loading').hide();
                }
            }, function (error) {
            });
        }
        else if (this.step == models_1.RegistrationStep.DBSCheck) {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutorsService.getSubScriptionFeatureByTutor().subscribe(function (res) {
                    _this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
                    _this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
                    if (!_this.dbsCheckAllowedInSubscriptoin) {
                        //this.submitDbsCheckForm('skip')
                        var objFormDatas = {
                            tutorId: success.tutorId,
                            hasDbsCheck: false,
                            dbsCertificateNumber: ''
                        };
                        _this.tutorsService.saveDbsCheck(objFormDatas)
                            .subscribe(function (success) {
                            $('.loading').hide();
                            _this.navigate(12);
                        }, function (error) {
                        });
                    }
                    else {
                        _this.tutorId = success.tutorId;
                        _this.dbsCheckFormSubmitted = false;
                        _this.dbsCheckForm = _this.fb.group({
                            tutorId: [success.tutorId],
                            userFirstName: [success.userFirstName],
                            hasDbsCheck: [success.hasDbsCheck],
                            dbsCertificateNumber: [success.dbsCertificateNumber, [forms_1.Validators.maxLength(250)]],
                            ProfileApprovalRequired: [0],
                        });
                        //this.getSubscription();
                        $('.loading').hide();
                    }
                }, function (err) {
                });
            }, function (error) {
            });
            //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
            //    this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
            //    this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
            //}, err => {
            //})
            this.moveToStep();
        }
        else if (this.step == models_1.RegistrationStep.Profile) {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutorId = success.tutorId;
                _this.tutorStoreProfileImageDownload = success.storeProfileImageDownload;
                _this.profileOneFormSubmitted = false;
                _this.profileOneForm = _this.fb.group({
                    tutorId: [success.tutorId],
                    userFirstName: [success.userFirstName],
                    header: [success.header, [forms_1.Validators.required, forms_1.Validators.maxLength(99)]],
                    //subHeader: [success.subHeader, [Validators.required, Validators.maxLength(1999)]],
                    biography: [success.biography, [forms_1.Validators.required, forms_1.Validators.maxLength(1999)]],
                });
                //if (!this.ProfileApprovalRequired) {
                //    this.submitProfileOneForm('skip');
                //    this.skipType = true;
                //    //this.navigate(12);
                //    return;
                //}
                _this.profileTwoFormSubmitted = false;
                _this.profileTwoForm = _this.fb.group({
                    tutorId: [success.tutorId],
                    userFirstName: [success.userFirstName],
                    profileTeachingExperiance: [success.profileTeachingExperiance, [forms_1.Validators.maxLength(1999)]],
                    profileHowITeach: [success.profileHowITeach, [forms_1.Validators.maxLength(1999)]],
                });
                $('.loading').hide();
            }, function (error) {
            });
            this.moveToStep();
        }
        else if (this.step == models_1.RegistrationStep.Qualifications) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(9);
            //    return;
            //}
            this.resetQualificationForm();
            this.tutorCertificatesService.getByTutor(this.tutorId)
                .subscribe(function (success) {
                _this.tutorCertificates = success;
            }, function (error) {
            });
            this.moveToStep();
        }
        else if (this.step == models_1.RegistrationStep.Subjects) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(10);
            //    return;
            //}
            //this.resetSubjectForm();
            //this.subjectsService.getOptions()
            //    .subscribe(success => {
            //        this.subjects = success;
            //    }, error => {
            //    });
            //this.subjectCategoriesService.getOptions()
            //    .subscribe(success => {
            //        this.subjectCategorys = success;
            //    }, error => {
            //    });
            //location.reload();
            //$('.loading').show();
            this.moveToStep();
        }
        else if (this.step == models_1.RegistrationStep.Availability) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(11);
            //    return;
            //}
            $('.loading').show();
            this.tutorsService.getAvailability(this.tutorId).subscribe(function (respt) {
                _this.registerdEvents = respt;
                $('.loading').hide();
            }, function (error) {
            });
            this.moveToStep();
        }
        else if (this.step == models_1.RegistrationStep.Preview) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(12);
            //    return;
            //}
            $('.loading').hide();
        }
        else if (this.step == models_1.RegistrationStep.Finish) {
            $('.loading').hide();
        }
    };
    TutorRegisterComponent.prototype.preventJoiningAnotherCompany = function () {
        if (this.journeyType == models_1.RegistrationJourneyType.TutorJoiningCompany) {
            if (this.currentCompany != null && this.company != null && this.company.companyId != this.currentCompany.companyId)
                window.location.href = "/home/forbidden?AlreadyJoinedAnotherCompany";
        }
    };
    TutorRegisterComponent.prototype.setupPaymentsPage = function () {
        if (this.journeyType == models_1.RegistrationJourneyType.TutorRegistration) {
            this.setupCardPaymentPage();
            this.moveToStep('dvPayment');
        }
        else {
            this.setupBankDetailsPage();
            this.moveToStep('dvBankDetail');
        }
    };
    TutorRegisterComponent.prototype.setupBankDetailsPage = function () {
        var _this = this;
        this.tutorsService.getMy()
            .subscribe(function (success) {
            _this.tutorId = success.tutorId;
            _this.bankDetailsFormSubmitted = false;
            _this.bankDetailsForm = _this.fb.group({
                bankAccountNumber: [success.bankAccountNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                bankSortCode: [success.bankSortCode, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
                addressLine1: [success.addressLine1, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                postCode: [success.postCode, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
            });
        }, function (error) { });
    };
    TutorRegisterComponent.prototype.setupCardPaymentPage = function () {
        var _this = this;
        this.tutorsService.getMy()
            .subscribe(function (success) {
            if (success != null && success.paymentStatus == 'Paid') {
                _this.navigate(models_1.RegistrationStep.PaymentApproved);
            }
            else {
                _this.stripeCountrysService.get()
                    .subscribe(function (success) {
                    _this.stripeCountrys = success;
                    _this.paymentFormSubmitted = false;
                    _this.paymentForm = _this.fb.group({
                        stripePlanId: [_this.stripePlanId, [forms_1.Validators.required]],
                        stripeCountryId: [_this.stripeCountrys[0].stripeCountryId, [forms_1.Validators.required]],
                        cardName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                        addressLine1: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                        paymentMethodId: [''],
                        intentId: [''],
                        stripeSubscriptionId: [''],
                        intentClientSecret: [''],
                        stripeCustomerId: [''],
                        requiresAction: [false],
                        promoCode: [null, [forms_1.Validators.maxLength(250)]]
                    });
                }, function (error) {
                });
                if (_this.stripePlan == null) {
                    _this.getStripePlanDetails(_this.stripePlanId);
                }
                _this.setupCardField();
                $('.loading').hide();
            }
        }, function (error) {
        });
    };
    TutorRegisterComponent.prototype.checkDateValid = function () {
        // Basic validation checks
        if (this.basicInfoForm.controls.dateOfBirthYear.errors || this.basicInfoForm.controls.dateOfBirthMonth.errors || this.basicInfoForm.controls.dateOfBirthDay.errors) {
            return false;
        }
        var dateString = this.getDateString();
        var date = Date.parse(dateString);
        // Check to see if a date can be created
        if (isNaN(date)) {
            return false;
        }
        // Check the date is not in the future
        else if (new Date(date) > new Date()) {
            return false;
        }
        else {
            // Check the date has not been modified when parsed (i.e. user has typed 30/02/1994 and has been parsed to 02/03/1994 as was invalid)
            if ((new Date(date)).toISOString() != dateString) {
                return false;
            }
        }
        return true;
    };
    ;
    TutorRegisterComponent.prototype.dateOfBirthInvalid = function () {
        if (this.checkDateValid()) {
            var dateOfBirth = new Date(Date.parse(this.getDateString()));
            var dateToMatch = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 13, dateToMatch.getMonth(), dateToMatch.getDay());
            if (dateOfBirth > dateToMatch) {
                return true;
            }
        }
        return false;
    };
    ;
    TutorRegisterComponent.prototype.getDateString = function () {
        return this.basicInfoForm.controls.dateOfBirthYear.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthMonth.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };
    ;
    //getSubscription() {
    //    this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
    //        this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
    //        this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
    //         
    //        if (!this.dbsCheckAllowedInSubscriptoin) {
    //            //this.submitDbsCheckForm('skip')
    //            //this.navigate(12);
    //            this.isApproved = true;
    //        } else {
    //            this.isApproved = false;
    //        }
    //    }, err => {
    //    })
    //}
    TutorRegisterComponent.prototype.submitBasicInfoForm = function () {
        var _this = this;
        debugger;
        this.basicInfoFormSubmitted = true;
        if (this.basicInfoForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            $('.loading').show();
            var basicInfo = {};
            // basicInfo = {
            //    ...this.basicInfoForm.getRawValue(),
            //    dateOfBirth: new Date(Date.parse(this.getDateString())),
            //    joiningCompanyId: this.companyId
            //};
            if (this.companyId && this.journeyType == 3) {
                basicInfo = __assign(__assign({}, this.basicInfoForm.getRawValue()), { dateOfBirth: new Date(Date.parse(this.getDateString())), joiningCompanyId: this.companyId, IDVerificationtStatus: 99, platFormUse: Number(this.basicInfoForm.getRawValue().platFormUse) });
            }
            else {
                basicInfo = __assign(__assign({}, this.basicInfoForm.getRawValue()), { dateOfBirth: new Date(Date.parse(this.getDateString())), joiningCompanyId: this.companyId, stripePlanId: this.stripePlan != null ? this.stripePlan.stripePlanId : '', IDVerificationtStatus: 0, platFormUse: Number(this.basicInfoForm.getRawValue().platFormUse) });
            }
            debugger;
            this.tutorsService.saveBasicInfo(basicInfo)
                .subscribe(function (success) {
                var _a;
                if (_this.companyId && _this.journeyType == 3) {
                    _this.navigate(models_1.RegistrationStep.Payment);
                }
                else if (((_a = _this.stripePlan) === null || _a === void 0 ? void 0 : _a.subscription.subscriptionPrice) > 0) {
                    debugger;
                    var objFormData = {
                        tutorId: success,
                        IsProfileCheck: true,
                        ProfileApprovalRequired: 0,
                        hasDbsCheck: true,
                        dbsCertificateNumber: '',
                    };
                    _this.tutorsService.saveDbsCheck(objFormData)
                        .subscribe(function (success) {
                        $('.loading').hide();
                        _this.navigate(12);
                    }, function (error) {
                    });
                }
                else {
                    //this.skipType = true;
                    //this.navigate(RegistrationStep.DBSCheck);
                    _this.tutorsService.getSubScriptionFeatureByTutor().subscribe(function (res) {
                        _this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
                        _this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
                        debugger;
                        if (!_this.dbsCheckAllowedInSubscriptoin) {
                            //this.submitDbsCheckForm('skip')
                            var objFormData = {
                                tutorId: success,
                                hasDbsCheck: false,
                                dbsCertificateNumber: '',
                                IsProfileCheck: true,
                                //ProfileApprovalRequired: this.ProfileApprovalRequired ? 0 : 99
                                ProfileApprovalRequired: 0
                            };
                            _this.tutorsService.saveDbsCheck(objFormData)
                                .subscribe(function (success) {
                                $('.loading').hide();
                                _this.navigate(12);
                            }, function (error) {
                            });
                        }
                        else {
                            debugger;
                            var objFormData = {
                                IsProfileCheck: true,
                                //ProfileApprovalRequired: this.ProfileApprovalRequired ? 0 : 99
                                ProfileApprovalRequired: 0
                            };
                            _this.tutorsService.saveDbsCheck(objFormData)
                                .subscribe(function (success) {
                                $('.loading').hide();
                                _this.navigate(12);
                            }, function (error) {
                            });
                            _this.navigate(models_1.RegistrationStep.DBSCheck);
                        }
                    }, function (err) {
                    });
                }
            }, function (error) {
                $('.loading').hide();
                _this.toastr.error('Please enter a valid date of birth');
            });
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.submitBankDetailsForm = function () {
        var _this = this;
        this.bankDetailsFormSubmitted = true;
        if (this.bankDetailsForm.valid) {
            this.tutorsService.saveBankDetail(this.bankDetailsForm.getRawValue())
                .subscribe(function (success) {
                _this.navigate(models_1.RegistrationStep.DBSCheck);
            }, function (err) { }, function () {
                $('.loading').hide();
            });
        }
        this.moveToStep();
    };
    TutorRegisterComponent.prototype.submitPaymentForm = function () {
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.createPaymentCard();
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.setupCardField = function () {
        var _this = this;
        setTimeout(function () {
            var elements = _this.stripe.elements();
            _this.card = elements.create('card');
            _this.card.mount('#card-info');
            _this.card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.style.display = 'block';
                    displayError.textContent = event.error.message;
                }
                else {
                    displayError.style.display = 'none';
                    displayError.textContent = '';
                }
            });
        }, 1000);
    };
    ;
    // "Apply" button click handler
    TutorRegisterComponent.prototype.checkPromoCode = function () {
        var _this = this;
        $('.loading').show();
        this.stripeService.validatePromoCode(this.paymentForm.controls.promoCode.value)
            .subscribe(function (success) {
            $('.loading').hide();
            _this.promoCodeChecked = true;
            if (success != null) {
                _this.coupon = success;
                _this.promoCodeInvalid = false;
                _this.validatedPromoCode = _this.paymentForm.controls.promoCode.value;
            }
            else {
                _this.coupon = null;
                _this.promoCodeInvalid = true;
                _this.validatedPromoCode = null;
            }
        }, function (err) {
            $('.loading').hide();
            _this.coupon = null;
            _this.promoCodeChecked = true;
            _this.promoCodeInvalid = true;
            _this.validatedPromoCode = null;
        });
    };
    ;
    TutorRegisterComponent.prototype.createPaymentCard = function () {
        var _this = this;
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(function (response) {
            _this.paymentCardResponse(response);
        });
    };
    ;
    TutorRegisterComponent.prototype.paymentCardResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        }
        else {
            this.step = models_1.RegistrationStep.PaymentProcessing;
            $('.loading').hide();
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };
    ;
    TutorRegisterComponent.prototype.confirmSubscriptionSend = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.savePayment(this.paymentForm.getRawValue())
            .subscribe(function (success) {
            _this.handleServerResponse(success);
            $('.loading').hide();
        }, function (err) {
            _this.handleStripeError(err.error);
            $('.loading').hide();
        });
    };
    ;
    TutorRegisterComponent.prototype.handleServerResponse = function (fetchResult) {
        var _this = this;
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(function (response) {
                _this.step = models_1.RegistrationStep.PaymentFailed;
                _this.cardActionResponse(response);
            });
        }
        else {
            this.step = models_1.RegistrationStep.PaymentApproved;
            this.navigate(this.step);
        }
    };
    ;
    TutorRegisterComponent.prototype.cardActionResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
        }
        else {
            this.confirmSubscriptionSend();
        }
    };
    ;
    TutorRegisterComponent.prototype.handleStripeError = function (error) {
        this.showStripeError = true;
        this.stripeError = error;
        this.step = models_1.RegistrationStep.Payment;
        this.setupCardField();
    };
    ;
    TutorRegisterComponent.prototype.hasDbsCheckValueChange = function () {
        this.dbsCheckForm.get('dbsCertificateNumber').clearValidators();
        if (this.dbsCheckFormControls.hasDbsCheck.value == true) {
            this.dbsCheckForm.get('dbsCertificateNumber').setValidators([forms_1.Validators.required, forms_1.Validators.maxLength(250)]);
        }
        this.dbsCheckForm.get('dbsCertificateNumber').updateValueAndValidity();
    };
    ;
    TutorRegisterComponent.prototype.submitDbsCheckForm = function (type) {
        var _this = this;
        if (type === void 0) { type = ''; }
        var objFormData = this.dbsCheckForm.getRawValue();
        //if (type == 'skip') {
        //    objFormData.hasDbsCheck = false;
        //}
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            $('.loading').show();
            this.tutorsService.saveDbsCheck(objFormData)
                .subscribe(function (success) {
                _this.navigate(models_1.RegistrationStep.Profile);
            }, function (error) {
            });
        }
    };
    ;
    TutorRegisterComponent.prototype.submitProfileOneForm = function (type) {
        var _this = this;
        if (type === void 0) { type = ''; }
        this.profileOneFormSubmitted = true;
        if (this.profileOneForm.valid || type == 'skip') {
            $('.loading').show();
            this.tutorsService.saveProfileOne(this.profileOneForm.getRawValue())
                .subscribe(function (success) {
                _this.profileFormSubStep = 2;
                //if (!this.ProfileApprovalRequired) {
                //    this.navigate(12);
                //}
                $('.loading').hide();
            }, function (error) {
            });
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.submitProfileTwoForm = function () {
        var _this = this;
        this.profileTwoFormSubmitted = true;
        if (this.profileTwoForm.valid) {
            $('.loading').show();
            this.tutorsService.saveProfileTwo(this.profileTwoForm.getRawValue())
                .subscribe(function (success) {
                _this.profileFormSubStep = 3;
                $('.loading').hide();
            }, function (error) {
            });
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.fileOverProfileThreeUploader = function (e) {
        this.profileThreeDropZoneOver = e;
    };
    TutorRegisterComponent.prototype.profileThreeUploaderFileDropped = function (e) {
        debugger;
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/
        var index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
        this.imageChangedEvent = e;
    };
    TutorRegisterComponent.prototype.submitProfileThreeForm = function () {
        var _this = this;
        if (this.profileThreeUploader.queue.length > 0) {
            debugger;
            $('.loading').show();
            /*const date: number = new Date().getTime();
            const file = new File([this.croppedProfileImage], 'photo', { type: 'image/png', lastModified: date });
            const fileItem = new FileItem(this.profileThreeUploader, file, {});
            this.profileThreeUploader.queue.push(fileItem);*/
            //fileItem.upload();
            /*this.profileThreeUploader.onBeforeUploadItem = (item) => {
                debugger;
                item.withCredentials = false;
            }*/
            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;
            this.profileThreeUploader.onErrorItem = function () {
                $('.loading').hide();
                _this.toastr.error('We were unable to upload your profile picture');
            };
            this.profileThreeUploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.profileThreeUploader.clearQueue();
                    _this.profileThreeUploaderShow = true;
                    _this.navigate(models_1.RegistrationStep.Qualifications);
                }
                else {
                    $('.loading').hide();
                    _this.toastr.error('We were unable to upload your profile picture');
                }
            };
        }
        else if (this.tutorStoreProfileImageDownload != null && this.tutorStoreProfileImageDownload.length > 0) {
            $('.loading').show();
            this.navigate(models_1.RegistrationStep.Qualifications);
        }
        else {
            this.toastr.error('Please upload a profile picture to continue');
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.resetQualificationForm = function () {
        var _this = this;
        this.tutorQualificationsService.getByTutor(this.tutorId)
            .subscribe(function (success) {
            _this.tutorQualifications = success;
            _this.qualificationFormSubmitted = false;
            _this.qualificationForm = _this.fb.group({
                tutorId: [_this.tutorId],
                name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            });
            $('.loading').hide();
        }, function (error) {
        });
    };
    ;
    TutorRegisterComponent.prototype.submitQualificationForm = function () {
        var _this = this;
        this.qualificationFormSubmitted = true;
        if (this.qualificationForm.valid) {
            $('.loading').show();
            this.tutorQualificationsService.create(this.qualificationForm.getRawValue())
                .subscribe(function (success) {
                _this.resetQualificationForm();
            }, function (error) {
            });
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.deleteTutorQualification = function (tutorQualification) {
        var _this = this;
        $('.loading').show();
        this.tutorQualificationsService.delete(tutorQualification.tutorQualificationId)
            .subscribe(function (success) {
            _this.tutorQualificationsService.getByTutor(_this.tutorId)
                .subscribe(function (success) {
                _this.tutorQualifications = success;
                $('.loading').hide();
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    TutorRegisterComponent.prototype.fileOverQualificationFormUploader = function (e) {
        this.qualificationFormDropZoneOver = e;
    };
    TutorRegisterComponent.prototype.qualificationFormUploaderFileDropped = function (e) {
        var _this = this;
        console.log(this.qualificationFormUploader.queue);
        if (this.qualificationFormUploader.queue.length > 0) {
            $('.loading').show();
            this.qualificationFormUploader.uploadAll();
            this.qualificationFormUploaderShow = false;
            this.qualificationFormUploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.qualificationFormUploader.clearQueue();
                    _this.qualificationFormUploaderShow = true;
                    _this.tutorCertificatesService.getByTutor(_this.tutorId)
                        .subscribe(function (success) {
                        _this.tutorCertificates = success;
                        $('.loading').hide();
                    }, function (error) {
                    });
                }
                else {
                    $('.loading').hide();
                    _this.qualificationFormUploader.clearQueue();
                    _this.qualificationFormUploaderShow = true;
                    _this.toastr.error('We were unable to upload your document');
                }
            };
        }
        else {
            this.toastr.error('Only PDF, PNG and JPEG allowed');
        }
    };
    TutorRegisterComponent.prototype.deleteTutorCertificate = function (tutorCertificate) {
        var _this = this;
        $('.loading').show();
        this.tutorCertificatesService.delete(tutorCertificate.tutorCertificateId)
            .subscribe(function (success) {
            _this.tutorCertificatesService.getByTutor(_this.tutorId)
                .subscribe(function (success) {
                _this.tutorCertificates = success;
                $('.loading').hide();
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    TutorRegisterComponent.prototype.resetSubjectForm = function () {
        var _this = this;
        this.tutorSubjectsService.getByTutor(this.tutorId)
            .subscribe(function (success) {
            _this.tutorSubjects = success;
            _this.subjectFormSubmitted = false;
            _this.subjectForm = _this.fb.group({
                tutorId: [_this.tutorId],
                subjectId: [null, [forms_1.Validators.required]],
                subjectCategoryId: [null, []],
                tutorSubjectStudyLevels: _this.fb.array([])
            });
            _this.studyLevelsService.getOptions()
                .subscribe(function (studyLevelsSuccess) {
                for (var i = 0; i < studyLevelsSuccess.length; i++) {
                    var tutorSubjectStudyLevel = _this.fb.group({
                        studyLevelId: [studyLevelsSuccess[i].id, []],
                        name: [studyLevelsSuccess[i].name, []],
                        checked: [false, []],
                    });
                    _this.tutorSubjectStudyLevelsFormArrayControls.push(tutorSubjectStudyLevel);
                }
            }, function (error) {
            });
            $('.loading').hide();
        }, function (error) {
        });
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.getSubjectCategorys = function () {
        var _this = this;
        if (this.subjectForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.subjectForm.get('subjectId').value)
                .subscribe(function (success) {
                _this.subjectCategorys = success;
                $('.loading').hide();
            }, function (error) {
            });
        }
    };
    ;
    TutorRegisterComponent.prototype.submitSubjectForm = function () {
        var _this = this;
        this.subjectFormSubmitted = true;
        if (this.subjectForm.valid) {
            if (this.tutorSubjectStudyLevelsFormArrayControls.value.filter(function (u) { return u.checked == true; }).length > 0) {
                $('.loading').show();
                this.tutorSubjectsService.create(this.subjectForm.getRawValue())
                    .subscribe(function (success) {
                    _this.resetSubjectForm();
                }, function (error) {
                });
            }
            else {
                this.toastr.error('Please select at least 1 level to save a subject');
            }
        }
        this.moveToStep();
    };
    ;
    TutorRegisterComponent.prototype.deleteTutorSubject = function (tutorSubject) {
        var _this = this;
        $('.loading').show();
        this.tutorSubjectsService.delete(tutorSubject.tutorSubjectId)
            .subscribe(function (success) {
            _this.resetSubjectForm();
        }, function (error) {
        });
    };
    ;
    TutorRegisterComponent.prototype.getStripePlanDetails = function (stripePlanId) {
        var _this = this;
        if (stripePlanId == null)
            return; // Skip this if not given.
        this.stripePlansService.getById(stripePlanId)
            .subscribe(function (success) {
            $('.loading').hide();
            console.log("StripePlanId and result:", stripePlanId, success);
            _this.stripePlan = success;
        }, function (error) {
        });
    };
    //getSubscription() {
    //    this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
    //        this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
    //        this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
    //         
    //        if (!this.dbsCheckAllowedInSubscriptoin) {
    //            this.skipType = true;
    //            this.submitDbsCheckForm('skip');
    //            this.skipType = true;
    //            //this.navigate(7);
    //        }
    //    }, err => {
    //    })
    //}
    TutorRegisterComponent.prototype.getSubscriptionName = function () {
        if (this.stripePlan && this.stripePlan.subscription && this.stripePlan.subscription.subscriptionName)
            return this.stripePlan.subscription.subscriptionName;
        else
            return "";
    };
    TutorRegisterComponent.prototype.submitCalendarData = function () {
        var _this = this;
        $('.loading').show();
        var obj = this.calendarRef.addedEvents;
        if (this.calendarRef.deletedEvents.length > 0) {
            Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
        }
        this.tutorsService.saveAvailability(obj).subscribe(function (success) {
            //this.navigate(this.registerStep.Preview)
            _this.navigate(_this.registerStep.Finish);
            $('.loading').hide();
        }, function (error) {
            //this.navigate(this.registerStep.Preview)
            _this.navigate(_this.registerStep.Finish);
            $('.loading').hide();
        });
        this.moveToStep();
    };
    //add price setup
    TutorRegisterComponent.prototype.addPriceForSubjectsTutors = function () {
        var dialogRef = this.dialog.open(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            width: '100%',
            panelClass: 'myClass',
            autoFocus: false,
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                //this.getSubjectStudyLevelSetupData();
            }
        });
    };
    TutorRegisterComponent.prototype.fileChangeEvent = function (event) {
        this.imageChangedEvent = event;
    };
    /*imageCropped(event: ImageCroppedEvent) {
        debugger;
        this.profileThreeUploaderPreviewUrl = event.base64;
        this.croppedProfileImage = this.b64toBlob(event.base64);
    }*/
    TutorRegisterComponent.prototype.cropMoved = function (data) {
        var _this = this;
        //debugger;
        var canvas = this.angularCropper.cropper.getCroppedCanvas({
            width: 170,
            height: 170,
        });
        this.profileThreeCroppedImage = canvas.toDataURL();
        canvas.toBlob(function (blob) {
            debugger;
            blob['name'] = 'myfilename.png';
            /*if (this.profileThreeUploader.queue.length > 1) {
                this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
            }*/
            // this.croppedProfileImage = blob;
            _this.profileThreeUploader.clearQueue();
            _this.profileThreeUploader.addToQueue([blob]);
        });
        $('.cropper img').show();
    };
    TutorRegisterComponent.prototype.imageLoaded = function (image) {
        debugger;
        //$('.source-image').parent().css('max-width', 500);
        // show cropper
    };
    TutorRegisterComponent.prototype.cropperReady = function () {
        // cropper ready
    };
    TutorRegisterComponent.prototype.loadImageFailed = function () {
        // show message
    };
    TutorRegisterComponent.prototype.b64toBlob = function (dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    };
    TutorRegisterComponent.prototype.moveToStep = function (dvId) {
        if (dvId === void 0) { dvId = 'dvInfo'; }
        var innerHeight = window.innerHeight;
        var innerWidth = window.innerWidth;
        if (innerWidth <= 967) {
            //console.log("Height:" + innerHeight + " " + "Width:" + innerWidth);
            setTimeout(function () {
                var $container = $("html,body");
                var $scrollTo = $('#' + dvId);
                $container.animate({ scrollTop: $scrollTo.offset().top, scrollLeft: 0 }, 1000);
            }, 500);
        }
    };
    __decorate([
        core_1.ViewChild('calendarRef'),
        __metadata("design:type", calender_component_1.CalenderComponent)
    ], TutorRegisterComponent.prototype, "calendarRef", void 0);
    __decorate([
        core_1.ViewChild('angularCropper'),
        __metadata("design:type", angular_cropperjs_1.CropperComponent)
    ], TutorRegisterComponent.prototype, "angularCropper", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TutorRegisterComponent.prototype, "onResize", null);
    TutorRegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-register',
            templateUrl: './tutor-register.component.html',
            styleUrls: ['./tutor-register.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.EnumsService, services_1.StripeService, services_1.StripePlansService, services_1.TutorQualificationsService, services_1.TutorCertificatesService, services_1.TutorSubjectsService, services_1.SubjectsService, services_1.SubjectCategoriesService, services_1.StudyLevelsService,
            platform_browser_1.DomSanitizer, services_1.CompanyService, services_1.StripeCountrysService])
    ], TutorRegisterComponent);
    return TutorRegisterComponent;
}());
exports.TutorRegisterComponent = TutorRegisterComponent;
//# sourceMappingURL=tutor-register.component.js.map