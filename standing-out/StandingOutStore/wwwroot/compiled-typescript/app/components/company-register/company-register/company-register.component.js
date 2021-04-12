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
exports.CompanyRegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var services_1 = require("../../../services");
var ng2_file_upload_1 = require("ng2-file-upload");
var service_helper_1 = require("../../../helpers/service.helper");
var ngx_toastr_1 = require("ngx-toastr");
var platform_browser_1 = require("@angular/platform-browser");
var $ = require("jquery");
var company_service_1 = require("../../../services/company.service");
var company_registration_step_enum_1 = require("../../../models/enums/company-registration-step.enum");
var dialog_1 = require("@angular/material/dialog");
var confirmation_dialog_component_1 = require("./confirmation-dialog.component");
var angular_cropperjs_1 = require("angular-cropperjs");
var CompanyRegisterComponent = /** @class */ (function () {
    function CompanyRegisterComponent(dialog, fb, toastr, companyService, enumsService, stripeService, stripeCountrysService, stripePlansService, tutorQualificationsService, tutorCertificatesService, tutorSubjectsService, subjectsService, subjectCategoriesService, studyLevelsService, sanitizer) {
        this.dialog = dialog;
        this.fb = fb;
        this.toastr = toastr;
        this.companyService = companyService;
        this.enumsService = enumsService;
        this.stripeService = stripeService;
        this.stripeCountrysService = stripeCountrysService;
        this.stripePlansService = stripePlansService;
        this.tutorQualificationsService = tutorQualificationsService;
        this.tutorCertificatesService = tutorCertificatesService;
        this.tutorSubjectsService = tutorSubjectsService;
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.sanitizer = sanitizer;
        this.serviceHelper = new service_helper_1.ServiceHelper();
        this.ownerEntityType = 'Company';
        this.stripePlanId = stripePlanId; // '81070046-8dc3-4ca9-3129-08d7e6c57421';
        this.companyId = undefined;
        this.companyFirstName = '';
        this.companyInitialRegistrationStep = 1; // Not 0
        this.isRegistrationDone = false;
        this.companyStoreProfileImageDownload = '';
        this.step = company_registration_step_enum_1.CompanyRegistrationStep.BasicInfo;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.userTitles = [];
        this.stripeCountrys = [];
        this.countries = [{ countryId: "United Kingdom", name: "United Kingdom" }];
        this.meetData = [];
        this.CompanyBasicInfoFormSubmitted = false;
        this.paymentFormSubmitted = false;
        this.showStripeError = false;
        this.stripeError = null;
        this.coupon = null;
        this.promoCodeChecked = false;
        this.promoCodeInvalid = false;
        this.validatedPromoCode = null;
        this.isCollapsed = false;
        // dbsCheckForm: FormGroup;
        // dbsCheckFormSubmitted: boolean = false;
        // get dbsCheckFormControls() { return this.dbsCheckForm.controls };
        this.profileFormSubStep = 1;
        this.profileOneFormSubmitted = false;
        this.profileTwoFormSubmitted = false;
        this.profileThreeFormSubmitted = false;
        // TODO Profile upload and (descoped) Member Image upload 
        this.profileThreeUploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + '/api/company/profileUpload', method: 'POST' });
        this.profileThreeDropZoneOver = false;
        this.profileThreeUploaderShow = true;
        this.uploader = new ng2_file_upload_1.FileUploader({ url: '', method: 'POST' });
        this.dropZoneOver = false;
        this.uploaderShow = true;
        this.isProfileEdited = false;
        this.colSize = 9;
        this.isGoBack = false;
        this.profileThreeCroppedImage = '';
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
    Object.defineProperty(CompanyRegisterComponent.prototype, "CompanyRegistrationStep", {
        get: function () { return company_registration_step_enum_1.CompanyRegistrationStep; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompanyRegisterComponent.prototype, "basicInfoFormCompanyControls", {
        get: function () { return this.companyBasicInfoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CompanyRegisterComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CompanyRegisterComponent.prototype, "profileOneFormControls", {
        get: function () { return this.profileOneForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CompanyRegisterComponent.prototype, "profileTwoFormControls", {
        get: function () { return this.profileTwoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CompanyRegisterComponent.prototype, "profileThreeFormControls", {
        get: function () { return this.profileThreeForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    CompanyRegisterComponent.prototype.getScreenSize = function (event) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
    };
    CompanyRegisterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getScreenSize();
        if (window.location.pathname == '/company/profile/edit') {
            this.isProfileEdited = true;
            this.colSize = 12;
            this.step = 6;
            this.isGoBack = true;
        }
        else {
            this.colSize = 9;
        }
        //get meet team data
        this.getMyTeamData();
        this.getStripePlanDetails(this.stripePlanId);
        this.companyBasicInfoForm = this.fb.group({
            title: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            telephoneNumber: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [''],
            mobileNumber: ['', [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            companyName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]],
            companyRegistrationNumber: [''],
            addressLine1: ['', [forms_1.Validators.required]],
            addressLine2: ['', [forms_1.Validators.required]],
            country: ['', [forms_1.Validators.required]],
            companyPostcode: ['', [forms_1.Validators.required]],
            companyTelephoneNumber: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            companyEmail: [''],
            companyMobileNumber: ['', [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            termsAndConditionsAccepted: [false, [forms_1.Validators.required]],
            marketingAccepted: [false, []],
            whoWeAre: [''],
            whatWeDo: [''],
            whyWeDoIt: [''],
            whyChooseUs: [''],
            platformUse: ['']
        });
        //payment page
        this.paymentForm = this.fb.group({
            stripePlanId: ['', [forms_1.Validators.required]],
            stripeCountryId: ['', [forms_1.Validators.required]],
            cardName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            addressLine1: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            postCode: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            promoCode: ['', [forms_1.Validators.required]],
            paymentMethodId: [''],
            intentId: [''],
            stripeSubscriptionId: [''],
            intentClientSecret: [''],
            stripeCustomerId: [''],
            requiresAction: [false]
        });
        //meet the team page
        this.profileTwoForm = this.fb.group({
            teamName: ['', [forms_1.Validators.required]],
            teamRole: ['', [forms_1.Validators.required]],
            teamDescription: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(500)]],
        });
        //profile three form
        //this.profileThreeForm = this.fb.group({
        //    whoWeAre: [''],
        //    whatWeDo: [''],
        //    whyWeDoIt: [''],
        //    whyChooseUs: ['']
        //});
        // To test diff views - uncomment and see ui at /company/register/process/81070046-8dc3-4ca9-3129-08d7e6c57421
        //this.companyInitialRegistrationStep = 1; // enum CompanyRegistrationStep.Profile (6) 
        //this.step = 1;
        this.companyService.getBasicInfo()
            .subscribe(function (success) {
            if (success != null) {
                debugger;
                _this.companyId = success.companyId;
                _this.companyFirstName = success.firstName;
                _this.companyInitialRegistrationStep = success.initialRegistrationStep;
                _this.isRegistrationDone = success.initialRegistrationComplete;
                if (success.initialRegistrationStep > 0 && !_this.isProfileEdited) {
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
            console.log(error);
            if (typeof error['Errors'] != "undefined") {
                console.log(error['Errors']);
            }
        });
    };
    ;
    CompanyRegisterComponent.prototype.getStripePlanDetails = function (stripePlanId) {
        var _this = this;
        this.stripePlansService.getById(stripePlanId)
            .subscribe(function (success) {
            $('.loading').hide();
            _this.stripePlan = success;
        }, function (error) {
        });
    };
    CompanyRegisterComponent.prototype.navigate = function (step) {
        var _this = this;
        debugger;
        $('.loading').show();
        this.step = step;
        this.companyService.updateInitialRegisterStep(this.step)
            .subscribe(function (success) {
            if (success != null) {
                _this.companyInitialRegistrationStep = success.initialRegistrationStep;
            }
        }, function (error) {
        });
        if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.BasicInfo) {
            this.enumsService.get('UserTitle')
                .subscribe(function (success) {
                _this.userTitles = success;
            }, function (error) {
            });
            this.companyService.getBasicInfo()
                .subscribe(function (success) {
                _this.CompanyBasicInfoFormSubmitted = false;
                _this.companyBasicInfoForm = _this.fb.group({
                    title: [success.title, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                    firstName: [success.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                    lastName: [success.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                    telephoneNumber: [success.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    email: [{ value: success.email, disabled: true }],
                    mobileNumber: [success.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    companyName: [success.companyName, [forms_1.Validators.required, forms_1.Validators.maxLength(60)]],
                    companyRegistrationNumber: [success.companyRegistrationNumber],
                    //companyAddress: [success.companyAddress, [Validators.required]],
                    addressLine1: [success.addressLine1, [forms_1.Validators.required]],
                    addressLine2: [success.addressLine2, [forms_1.Validators.required]],
                    country: [success.country, [forms_1.Validators.required]],
                    companyPostcode: [success.companyPostcode, [forms_1.Validators.required]],
                    companyTelephoneNumber: [success.companyTelephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    companyEmail: [success.companyEmail],
                    companyMobileNumber: [success.companyMobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                    termsAndConditionsAccepted: [Boolean(success.termsAndConditionsAccepted), [forms_1.Validators.required]],
                    marketingAccepted: [success.marketingAccepted, []],
                    whoWeAre: [success.whoWeAre],
                    whatWeDo: [success.whatWeDo],
                    whyWeDoIt: [success.whyWeDoIt],
                    platformUse: ['1'],
                });
                $('.loading').hide();
            }, function (error) {
                console.log('Get basic info failed.. in error case');
            });
            this.moveToStep();
        }
        else if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.Payment) {
            this.companyService.getBasicInfo()
                .subscribe(function (success) {
                if (success != null && success.paymentStatus == 'Paid') {
                    _this.navigate(company_registration_step_enum_1.CompanyRegistrationStep.PaymentApproved);
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
                            promoCode: [null, [forms_1.Validators.maxLength(250)]],
                            postCode: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                            paymentMethodId: [''],
                            intentId: [''],
                            stripeSubscriptionId: [''],
                            intentClientSecret: [''],
                            stripeCustomerId: [''],
                            requiresAction: [false],
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
            this.moveToStep();
        }
        else if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.PaymentApproved) {
            this.companyService.getBasicInfo()
                .subscribe(function (success) {
                //debugger;
                if (success != null) {
                    _this.companyId = success.companyId;
                    _this.companyFirstName = success.firstName;
                    $('.loading').hide();
                }
            }, function (error) {
            });
            this.moveToStep();
        }
        else if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.Profile) {
            this.companyService.getMy()
                .subscribe(function (success) {
                //debugger;
                _this.companyStoreProfileImageDownload = success.storeProfileImageDownload;
                _this.profileOneFormSubmitted = false;
                _this.profileOneForm = _this.fb.group({
                    companyId: [success.companyId],
                    companyName: [success.companyName],
                    companyDescription: [success.companyDescription, [forms_1.Validators.required, forms_1.Validators.maxLength(1999)]],
                    whoWeAre: [success.whoWeAre, [forms_1.Validators.maxLength(1999)]],
                    whatWeDo: [success.whatWeDo, [forms_1.Validators.maxLength(1999)]],
                    whyWeDoIt: [success.whyWeDoIt, [forms_1.Validators.maxLength(1999)]],
                    whyChooseUs: [success.whyChooseUs, [forms_1.Validators.maxLength(1999)]],
                    platformUse: ['1']
                });
                _this.profileTwoFormSubmitted = false;
                _this.profileTwoForm = _this.fb.group({
                    teamName: ['', [forms_1.Validators.required]],
                    teamRole: ['', [forms_1.Validators.required]],
                    teamDescription: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(1999)]],
                });
                //profile three form
                //this.profileThreeFormSubmitted = false;
                //this.profileThreeForm = this.fb.group({
                //    whoWeAre: [success.whoWeAre],
                //    whatWeDo: [success.whatWeDo],
                //    whyWeDoIt: [success.whyWeDoIt],
                //    whyChooseUs: [success.whyChooseUs]
                //});
                $('.loading').hide();
            }, function (error) {
            });
            if (!this.profileOneFormSubmitted) {
                this.moveToStep();
            }
            else {
                this.moveToStep('addTeamMembers');
            }
        }
        else if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.Price) {
            this.moveToStep();
        }
        else if (this.step == company_registration_step_enum_1.CompanyRegistrationStep.Finish) {
            $('.loading').hide();
        }
    };
    CompanyRegisterComponent.prototype.submitCompanyBasicInfoForm = function () {
        var _this = this;
        debugger;
        this.CompanyBasicInfoFormSubmitted = true;
        if (this.companyBasicInfoForm.valid) {
            $('.loading').show();
            var companyRegisterBasicInfo = __assign({}, this.companyBasicInfoForm.getRawValue());
            companyRegisterBasicInfo.stripePlanId = this.stripePlanId;
            this.companyService.saveCompanyBasicInfo(companyRegisterBasicInfo)
                .subscribe(function (success) {
                _this.toastr.success('Company details saved sucessfully!');
                _this.navigate(company_registration_step_enum_1.CompanyRegistrationStep.Payment);
            }, function (error) {
                $('.loading').hide();
                _this.toastr.error('Something went wrong');
            });
        }
    };
    ;
    CompanyRegisterComponent.prototype.submitPaymentForm = function () {
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.createPaymentCard();
        }
    };
    ;
    CompanyRegisterComponent.prototype.setupCardField = function () {
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
        }, 3000);
    };
    ;
    CompanyRegisterComponent.prototype.checkPromoCode = function () {
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
    CompanyRegisterComponent.prototype.createPaymentCard = function () {
        var _this = this;
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(function (response) {
            console.log("createPaymentCard billing_details:", response);
            _this.paymentCardResponse(response);
        });
    };
    ;
    CompanyRegisterComponent.prototype.paymentCardResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        }
        else {
            this.step = company_registration_step_enum_1.CompanyRegistrationStep.PaymentProcessing;
            $('.loading').hide();
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };
    ;
    CompanyRegisterComponent.prototype.confirmSubscriptionSend = function () {
        var _this = this;
        $('.loading').show();
        this.companyService.savePayment(this.paymentForm.getRawValue())
            .subscribe(function (success) {
            _this.handleServerResponse(success);
            $('.loading').hide();
        }, function (err) {
            _this.handleStripeError(err.error);
            $('.loading').hide();
        });
    };
    ;
    CompanyRegisterComponent.prototype.handleServerResponse = function (fetchResult) {
        var _this = this;
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(function (response) {
                _this.step = company_registration_step_enum_1.CompanyRegistrationStep.PaymentFailed;
                _this.cardActionResponse(response);
            });
        }
        else {
            this.step = company_registration_step_enum_1.CompanyRegistrationStep.PaymentApproved;
            this.navigate(this.step);
        }
    };
    ;
    CompanyRegisterComponent.prototype.cardActionResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
        }
        else {
            this.confirmSubscriptionSend();
        }
    };
    ;
    CompanyRegisterComponent.prototype.handleStripeError = function (error) {
        this.showStripeError = true;
        this.stripeError = error;
        this.step = company_registration_step_enum_1.CompanyRegistrationStep.Payment;
        this.setupCardField();
    };
    ;
    // Description and (todo) Profile Image upload
    CompanyRegisterComponent.prototype.submitProfileOneForm = function () {
        var _this = this;
        debugger;
        this.profileOneFormSubmitted = true;
        if (this.profileOneForm.valid) {
            $('.loading').show();
            //debugger; 
            this.companyService.saveProfileOne(this.profileOneForm.getRawValue())
                .subscribe(function (success) {
                _this.toastr.success('Details saved!');
                $('#addTeamMembers').css('display', 'block');
                // this.profileFormSubStep = 2;
                //this.navigate(CompanyRegistrationStep.Price);
                $('.loading').hide();
                if (_this.profileThreeUploader.queue.length > 0) {
                    _this.uploadCompanyProfileImage();
                }
            }, function (error) {
            });
        }
    };
    ;
    CompanyRegisterComponent.prototype.uploadCompanyProfileImage = function () {
        var _this = this;
        if (this.profileThreeUploader.queue.length > 0) {
            $('.loading').show();
            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;
            this.profileThreeUploader.onErrorItem = function () {
                $('.loading').hide();
                _this.toastr.error('We were unable to upload your logo');
            };
            this.profileThreeUploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.profileThreeUploader.clearQueue();
                    _this.profileThreeUploaderShow = true;
                    _this.toastr.success('Logo uploaded successfully!!');
                    _this.navigate(company_registration_step_enum_1.CompanyRegistrationStep.Profile);
                }
                else {
                    $('.loading').hide();
                    _this.toastr.error('We were unable to upload your logo');
                }
            };
        }
        else if (this.companyStoreProfileImageDownload != null && this.companyStoreProfileImageDownload.length > 0) {
            this.toastr.error('Logo uploaded successfully!!');
            // As this is only Add button click, we dont navigate anywhere.
        }
        else {
            this.toastr.error('Please upload a logo to continue');
        }
    };
    // Add company members form
    CompanyRegisterComponent.prototype.submitProfileTwoForm = function () {
        var _this = this;
        this.profileTwoFormSubmitted = true;
        if (this.profileTwoForm.valid) {
            $('.loading').show();
            this.companyService.addCompanyMember(this.profileTwoForm.getRawValue())
                .subscribe(function (success) {
                _this.getMyTeamData();
                // this.profileFormSubStep = 3;
                _this.profileTwoForm.reset();
                _this.toastr.success('Member added!');
                $('.loading').hide();
                _this.profileTwoFormSubmitted = false;
            }, function (error) {
            });
        }
    };
    ;
    CompanyRegisterComponent.prototype.fileOverProfileThreeUploader = function (e) {
        this.profileThreeDropZoneOver = e;
    };
    CompanyRegisterComponent.prototype.profileThreeUploaderFileDropped = function (e) {
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/
        var index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
        //var reader = new FileReader();
        //if (e.target) {
        //    reader.readAsDataURL(e.target.files[0]);
        //    reader.onload = (event) => {
        //        this.profileThreeUploaderPreviewUrl = event.target.result;
        //    }
        //}
    };
    //submitProfileThreeForm() {
    //    this.profileThreeFormSubmitted = true;
    //    $('.loading').show();
    //    var profileThreeData = this.profileThreeForm.getRawValue();
    //    var profileOneData = this.profileOneForm.getRawValue();
    //    profileThreeData.companyDescription = profileOneData.companyDescription;
    //    profileThreeData.companyId = this.companyId;
    //    this.companyService.saveProfileThree(profileThreeData)
    //        .subscribe(success => {
    //            $('.loading').hide();
    //            this.toastr.success('Saved successfully!');
    //            if (this.isProfileEdited) {
    //                window.location.href = '/admin'; 
    //                return;
    //            }
    //            this.navigate(CompanyRegistrationStep.Finish);
    //        }, error => {
    //            this.toastr.error('Something went wrong!');
    //        });
    //};
    // Descoped for now.
    CompanyRegisterComponent.prototype.teamFileDropped = function (event) {
        var _this = this;
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            //to show preview
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function (event) {
                _this.meetLogo = event.target.result;
            };
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.companyService.getBasicInfo()
                        .subscribe(function (success) {
                        _this.company = success;
                        $('.loading').hide();
                    }, function (error) {
                    });
                }
                else {
                    $('.loading').hide();
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.toastr.error('We were unable to upload your logo');
                }
            };
        }
    };
    //get my team data
    CompanyRegisterComponent.prototype.getMyTeamData = function () {
        var _this = this;
        this.companyService.getTeamData()
            .subscribe(function (success) {
            if (success != null) {
                console.log("Got Team data:", success);
                _this.meetData = success;
            }
        }, function (error) {
            // debugger;
        });
    };
    CompanyRegisterComponent.prototype.getSubscriptionName = function () {
        if (this.stripePlan && this.stripePlan.subscription && this.stripePlan.subscription.subscriptionName)
            //return this.stripePlan.subscription.subscriptionName;
            return this.stripePlan.subscription.description;
        else
            return "";
    };
    CompanyRegisterComponent.prototype.getSubscriptionPrice = function () {
        if (this.stripePlan.subscription.subscriptionPrice)
            //return this.stripePlan.subscription.subscriptionName;
            return this.stripePlan.subscription.subscriptionPrice;
    };
    //delete team data
    CompanyRegisterComponent.prototype.openDialog = function (mbrId, index) {
        var _this = this;
        var dialogRef = this.dialog.open(confirmation_dialog_component_1.ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });
        dialogRef.afterClosed().subscribe(function (confirmed) {
            if (confirmed) {
                //debugger;
                //this.meetData.splice(index, 1);
                // delete query will gone here
                _this.companyService.deleteCompanyMember(mbrId)
                    .subscribe(function (success) {
                    _this.meetData.splice(index, 1); // Splice after delete is success
                    _this.toastr.success('Member removed!');
                    //console.log(success);
                }, function (error) {
                });
            }
        });
    };
    CompanyRegisterComponent.prototype.cropMoved = function (data) {
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
    CompanyRegisterComponent.prototype.moveToStep = function (dvId) {
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
        core_1.ViewChild('angularCropper'),
        __metadata("design:type", angular_cropperjs_1.CropperComponent)
    ], CompanyRegisterComponent.prototype, "angularCropper", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CompanyRegisterComponent.prototype, "getScreenSize", null);
    CompanyRegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-company-register',
            templateUrl: './company-register.component.html',
            styleUrls: ['./company-register.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, forms_1.FormBuilder, ngx_toastr_1.ToastrService, company_service_1.CompanyService, services_1.EnumsService, services_1.StripeService, services_1.StripeCountrysService, services_1.StripePlansService, services_1.TutorQualificationsService, services_1.TutorCertificatesService, services_1.TutorSubjectsService, services_1.SubjectsService, services_1.SubjectCategoriesService, services_1.StudyLevelsService, platform_browser_1.DomSanitizer])
    ], CompanyRegisterComponent);
    return CompanyRegisterComponent;
}());
exports.CompanyRegisterComponent = CompanyRegisterComponent;
//# sourceMappingURL=company-register.component.js.map