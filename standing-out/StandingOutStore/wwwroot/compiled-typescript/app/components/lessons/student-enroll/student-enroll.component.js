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
exports.StudentEnrollComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var forms_1 = require("@angular/forms");
var helpers_1 = require("../../../helpers");
var partials_1 = require("../../../partials");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var StudentEnrollComponent = /** @class */ (function () {
    function StudentEnrollComponent(coursesService, classSessionsService, usersService, enumsService, formBuilder, utilities, modalService) {
        this.coursesService = coursesService;
        this.classSessionsService = classSessionsService;
        this.usersService = usersService;
        this.enumsService = enumsService;
        this.formBuilder = formBuilder;
        this.utilities = utilities;
        this.modalService = modalService;
        this.title = title;
        this.courseId = courseId;
        //classSessionId: string = classSessionId;
        this.lesson = null;
        this.course = null;
        this.user = null;
        this.userTitles = [];
        this.cameFromLinkAccount = cameFromLinkAccount;
        //if (localStorage.getItem('uniqueNumber') != '') {
        //    window.location.href = '/my-course'
        //}
    }
    Object.defineProperty(StudentEnrollComponent.prototype, "userDetailFormControls", {
        get: function () { return this.userDetailForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    StudentEnrollComponent.prototype.getLessonCard = function (classSessionId) {
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
    StudentEnrollComponent.prototype.getUser = function () {
        var _this = this;
        this.usersService.getMy()
            .subscribe(function (success) {
            _this.user = success;
            if (!_this.user.isSetupComplete) {
                _this.setupUserDetailForm(_this.user);
            }
            _this.checkGoogleAccount();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    StudentEnrollComponent.prototype.getUserTitel = function () {
        var _this = this;
        this.enumsService.get('UserTitle')
            .subscribe(function (success) {
            _this.userTitles = success;
        }, function (error) {
        });
    };
    // #region User First Time Setup
    StudentEnrollComponent.prototype.setupUserDetailForm = function (user) {
        this.userDetailForm = this.formBuilder.group({
            title: [user.title, [forms_1.Validators.required]],
            //stripeCountryId: [this.stripeCountryId, [Validators.required]],
            firstName: [user.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            lastName: [user.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            //childFirstName: ['', [Validators.required, Validators.maxLength(250)]],
            //childLastName: ['', [Validators.required, Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            termsAndConditionsAccepted: [false, [forms_1.Validators.requiredTrue]],
            dateOfBirthDay: [new Date(user.dateOfBirth).getDate(), [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
            dateOfBirthMonth: [new Date(user.dateOfBirth).getMonth() + 1, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
            dateOfBirthYear: [new Date(user.dateOfBirth).getFullYear(), [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.minLength(4), forms_1.Validators.maxLength(4)]],
        });
    };
    ;
    StudentEnrollComponent.prototype.checkDateValid = function () {
        // Basic validation checks
        if (this.userDetailForm.controls.dateOfBirthYear.errors || this.userDetailForm.controls.dateOfBirthMonth.errors || this.userDetailForm.controls.dateOfBirthDay.errors) {
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
    StudentEnrollComponent.prototype.dateOfBirthInvalid = function () {
        if (this.course == null) {
            return false;
        }
        else if (this.checkDateValid()) {
            if (this.course.isUnder18) {
                var dateOfBirth = new Date(Date.parse(this.getDateString()));
                var dateToMatch = (new Date());
                dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
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
    StudentEnrollComponent.prototype.getDateString = function () {
        return this.userDetailForm.controls.dateOfBirthYear.value + '-' +
            (this.userDetailForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.userDetailForm.controls.dateOfBirthMonth.value + '-' +
            (this.userDetailForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.userDetailForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };
    ;
    StudentEnrollComponent.prototype.submitUserDetailForm = function () {
        var _this = this;
        debugger;
        //return;
        this.userDetailFormSubmitted = true;
        if (this.userDetailForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            this.usersService.completeStudentSetup(__assign(__assign({}, this.userDetailForm.value), { dateOfBirth: new Date(Date.parse(this.getDateString())) }))
                .subscribe(function (success) {
                _this.user = success;
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    // #endregion User First Time Setup
    StudentEnrollComponent.prototype.ngOnInit = function () {
        this.getUser();
        this.getUserTitel();
        // this.getLessonCard();    
        //get course details
        this.getCourse();
        //this.stripeCountrysService.get()
        //    .subscribe(countrySuccess => {
        //        this.stripeCountrys = countrySuccess;
        //    });
    };
    ;
    StudentEnrollComponent.prototype.getCourse = function () {
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
    StudentEnrollComponent.prototype.checkGoogleAccount = function () {
        if (this.course != undefined && this.course.requiresGoogleAccount == true && this.user != undefined && this.user.hasGoogleAccountLinked == false) {
            var modalRef = this.modalService.open(partials_1.LessonEnrollModal, { size: 'lg' });
            modalRef.result.then(function (result) {
            }, function (reason) {
            });
        }
        else if (this.course != undefined && this.user != undefined && this.cameFromLinkAccount == 'True' && this.user.hasGoogleAccountLinked == true) {
            var modalRef = this.modalService.open(partials_1.LessonEnrollLinkedAccountModal, { size: 'md' });
            modalRef.result.then(function (result) {
            }, function (reason) {
            });
        }
    };
    ;
    StudentEnrollComponent.prototype.back = function () {
        window.location.href = '/find-a-lesson' + (this.course.isUnder18 ? '?isUnder18=true' : '');
    };
    ;
    StudentEnrollComponent = __decorate([
        core_1.Component({
            selector: 'app-student-enroll',
            templateUrl: './student-enroll.component.html'
        }),
        __metadata("design:paramtypes", [index_1.CoursesService, index_1.ClassSessionsService, index_1.UsersService, index_1.EnumsService, forms_1.FormBuilder, helpers_1.UtilitiesHelper, ng_bootstrap_1.NgbModal])
    ], StudentEnrollComponent);
    return StudentEnrollComponent;
}());
exports.StudentEnrollComponent = StudentEnrollComponent;
//# sourceMappingURL=student-enroll.component.js.map