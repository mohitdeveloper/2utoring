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
exports.GuardianEnrollComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var forms_1 = require("@angular/forms");
var partials_1 = require("../../../partials");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var GuardianEnrollComponent = /** @class */ (function () {
    function GuardianEnrollComponent(coursesService, classSessionsService, usersService, enumsService, formBuilder, modalService, settingsService) {
        this.coursesService = coursesService;
        this.classSessionsService = classSessionsService;
        this.usersService = usersService;
        this.enumsService = enumsService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.settingsService = settingsService;
        this.title = title;
        this.courseId = courseId;
        //classSessionId: string = classSessionId;
        this.step = index_1.GuardianRegistrationStep.GuardianDetail;
        this.lesson = null;
        this.course = null;
        this.user = null;
        this.userTitles = [];
        this.cameFromLinkAccount = cameFromLinkAccount;
        this.isSupportedPayout = true;
        this.userStripeCountryId = null;
        this.conversionPercent = 0;
        this.conversionFlat = 0;
        //if (localStorage.getItem('uniqueNumber') != '') {
        //    window.location.href = '/my-course'
        //}
    }
    Object.defineProperty(GuardianEnrollComponent.prototype, "guardianRegistrationStep", {
        get: function () { return index_1.GuardianRegistrationStep; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(GuardianEnrollComponent.prototype, "guardianDetailFormControls", {
        get: function () { return this.guardianDetailForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(GuardianEnrollComponent.prototype, "childDetailFormControls", {
        get: function () { return this.childDetailForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    GuardianEnrollComponent.prototype.getLessonCard = function (classSessionId) {
        var _this = this;
        this.classSessionsService.getCard(classSessionId)
            .subscribe(function (success) {
            _this.lesson = success;
            _this.checkGoogleAccount();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    GuardianEnrollComponent.prototype.getSetting = function () {
        var _this = this;
        this.settingsService.getSetting().subscribe(function (success) {
            _this.conversionPercent = success.conversionPercent;
            _this.conversionFlat = success.conversionFlat;
        });
    };
    GuardianEnrollComponent.prototype.getUser = function () {
        var _this = this;
        this.usersService.getMyGuardian()
            .subscribe(function (success) {
            _this.user = success;
            if (!_this.user.isSetupComplete) {
                _this.setupGuardianDetailForm(_this.user);
                _this.setupChildDetailForm(_this.user);
            }
            _this.checkGoogleAccount();
            debugger;
            if (_this.user.stripeCountry != null) {
                if (_this.user.stripeCountry.supportedPayout == true) {
                    _this.isSupportedPayout = true;
                    _this.userStripeCountryId = _this.user.stripeCountry.stripeCountryId;
                }
                else {
                    _this.isSupportedPayout = false;
                    _this.userStripeCountryId = _this.user.stripeCountry.stripeCountryId;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    ;
    GuardianEnrollComponent.prototype.getSupportedPayout = function (supportedPayout) {
        this.isSupportedPayout = supportedPayout;
    };
    GuardianEnrollComponent.prototype.getUserTitel = function () {
        var _this = this;
        this.enumsService.get('UserTitle')
            .subscribe(function (success) {
            _this.userTitles = success;
        }, function (error) {
        });
    };
    // #region User First Time Setup
    GuardianEnrollComponent.prototype.setupGuardianDetailForm = function (user) {
        this.guardianDetailForm = this.formBuilder.group({
            parentTitle: [user.childTitle, [forms_1.Validators.required]],
            firstName: [user.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            lastName: [user.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            termsAndConditionsAccepted: [false, [forms_1.Validators.requiredTrue]]
        });
    };
    ;
    GuardianEnrollComponent.prototype.setupChildDetailForm = function (user) {
        this.childDetailForm = this.formBuilder.group({
            childTitle: [user.childTitle, [forms_1.Validators.required]],
            childFirstName: [user.childFirstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            childLastName: [user.childLastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            dateOfBirthDay: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
            dateOfBirthMonth: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
            dateOfBirthYear: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.minLength(4), forms_1.Validators.maxLength(4)]],
        });
    };
    ;
    GuardianEnrollComponent.prototype.checkDateValid = function () {
        // Basic validation checks
        if (this.childDetailForm.controls.dateOfBirthYear.errors || this.childDetailForm.controls.dateOfBirthMonth.errors || this.childDetailForm.controls.dateOfBirthDay.errors) {
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
    GuardianEnrollComponent.prototype.dateOfBirthInvalid = function () {
        if (this.course == null) {
            return false;
        }
        else if (this.checkDateValid()) {
            if (this.course.isUnder18) {
                var dateOfBirth = new Date(Date.parse(this.getDateString()));
                var dateToMatch = (new Date());
                console.log(dateToMatch);
                console.log(dateToMatch.getDay());
                dateToMatch.setFullYear(dateToMatch.getFullYear() - 19);
                //dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
                console.log(dateToMatch);
                if (dateOfBirth < dateToMatch) {
                    return true;
                }
            }
            else {
                var dateOfBirth = new Date(Date.parse(this.getDateString()));
                var dateToMatch = (new Date());
                dateToMatch = new Date(dateToMatch.getFullYear() - 17, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
                if (dateOfBirth > dateToMatch) {
                    return true;
                }
            }
        }
        return false;
    };
    ;
    GuardianEnrollComponent.prototype.getDateString = function () {
        return this.childDetailForm.controls.dateOfBirthYear.value + '-' +
            (this.childDetailForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.childDetailForm.controls.dateOfBirthMonth.value + '-' +
            (this.childDetailForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.childDetailForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };
    ;
    GuardianEnrollComponent.prototype.submitGuardianDetailForm = function () {
        this.guardianDetailFormSubmitted = true;
        if (this.guardianDetailForm.valid) {
            this.step = index_1.GuardianRegistrationStep.ChildDetail;
        }
    };
    ;
    GuardianEnrollComponent.prototype.submitChildDetailForm = function () {
        var _this = this;
        this.childDetailFormSubmitted = true;
        if (this.childDetailForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            this.usersService.completeGuardianSetup(__assign(__assign(__assign({}, (this.childDetailForm.value)), { childDateOfBirth: new Date(Date.parse(this.getDateString())) }), (this.guardianDetailForm.value)))
                .subscribe(function (success) {
                _this.user = success;
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    GuardianEnrollComponent.prototype.back = function () {
        if (this.step == index_1.GuardianRegistrationStep.GuardianDetail) {
            window.location.href = '/find-a-lesson' + (this.lesson.isUnder16 ? '?under16=true' : '');
        }
        else if (this.step == index_1.GuardianRegistrationStep.ChildDetail) {
            this.step = index_1.GuardianRegistrationStep.GuardianDetail;
        }
    };
    ;
    // #endregion User First Time Setup
    GuardianEnrollComponent.prototype.ngOnInit = function () {
        this.getSetting();
        this.getUser();
        this.getUserTitel();
        //this.getLessonCard();
        this.getCourse();
    };
    ;
    GuardianEnrollComponent.prototype.getCourse = function () {
        var _this = this;
        this.coursesService.getPurchaseCouresData(courseId)
            .subscribe(function (success) {
            debugger;
            _this.getLessonCard(success.classSessions[0].classSessionId);
            _this.course = success;
            _this.checkGoogleAccount();
        }, function (error) {
            console.log(error);
        });
    };
    GuardianEnrollComponent.prototype.checkGoogleAccount = function () {
        if (this.course != undefined && this.course.requiresGoogleAccount == true && this.user != undefined && this.user.hasGoogleAccountLinked == false) {
            var modalRef = this.modalService.open(partials_1.LessonEnrollModal, { size: 'lg' });
            modalRef.result.then(function (result) {
            }, function (reason) {
            });
        }
        else if (this.cameFromLinkAccount == 'True' && this.user.hasGoogleAccountLinked == true) {
            var modalRef = this.modalService.open(partials_1.LessonEnrollLinkedAccountModal, { size: 'md' });
            modalRef.result.then(function (result) {
            }, function (reason) {
            });
        }
    };
    ;
    GuardianEnrollComponent = __decorate([
        core_1.Component({
            selector: 'app-guardian-enroll',
            templateUrl: './guardian-enroll.component.html'
        }),
        __metadata("design:paramtypes", [index_2.CoursesService, index_2.ClassSessionsService, index_2.UsersService, index_2.EnumsService,
            forms_1.FormBuilder, ng_bootstrap_1.NgbModal, index_2.SettingsService])
    ], GuardianEnrollComponent);
    return GuardianEnrollComponent;
}());
exports.GuardianEnrollComponent = GuardianEnrollComponent;
//# sourceMappingURL=guardian-enroll.component.js.map