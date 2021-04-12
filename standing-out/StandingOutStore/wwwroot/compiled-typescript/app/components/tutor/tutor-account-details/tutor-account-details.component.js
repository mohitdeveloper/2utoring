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
exports.TutorAccountDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var TutorAccountDetailsComponent = /** @class */ (function () {
    function TutorAccountDetailsComponent(fb, toastr, tutorsService, enumsService) {
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.enumsService = enumsService;
        this.userTitles = [];
        this.bankDetailsApplicable = false;
        this.isCompanyTutor = false;
        this.basicInfoFormSubmitted = false;
        this.bankDetailsFormSubmitted = false;
    }
    Object.defineProperty(TutorAccountDetailsComponent.prototype, "basicInfoFormControls", {
        get: function () { return this.basicInfoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorAccountDetailsComponent.prototype, "bankDetailsFormControls", {
        get: function () { return this.bankDetailsForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    TutorAccountDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.enumsService.get('UserTitle')
            .subscribe(function (success) {
            _this.userTitles = success;
        }, function (error) {
        });
        this.resetForm();
    };
    TutorAccountDetailsComponent.prototype.resetForm = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.getBasicInfo()
            .subscribe(function (success) {
            console.log("CurrentCompany:", success.currentCompany);
            _this.isCompanyTutor = (success.currentCompany != null);
            _this.bankDetailsApplicable = _this.isCompanyTutor;
            if (_this.isCompanyTutor)
                _this.setupBankDetailsPage(); // Setup bank Details Form if applicable
            _this.basicInfoFormSubmitted = false;
            _this.basicInfoForm = _this.fb.group({
                userId: [success.userId],
                title: [success.title, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                firstName: [success.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                lastName: [success.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                telephoneNumber: [success.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                email: [{ value: success.email, disabled: true }],
                dateOfBirthDay: [success.dateOfBirthDay, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
                dateOfBirthMonth: [success.dateOfBirthMonth, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.maxLength(2)]],
                dateOfBirthYear: [success.dateOfBirthYear, [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$'), forms_1.Validators.minLength(4), forms_1.Validators.maxLength(4)]],
                mobileNumber: [success.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                //termsAndConditionsAccepted: [success.termsAndConditionsAccepted, [Validators.required]],
                marketingAccepted: [success.marketingAccepted, []],
            });
            $('.loading').hide();
        }, function (error) {
        });
    };
    ;
    TutorAccountDetailsComponent.prototype.setupBankDetailsPage = function () {
        var _this = this;
        this.tutorsService.getMy()
            .subscribe(function (success) {
            console.log("Got bank details:", success);
            _this.bankDetailsFormSubmitted = false;
            _this.bankDetailsForm = _this.fb.group({
                bankAccountNumber: [success.bankAccountNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                bankSortCode: [success.bankSortCode, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
                addressLine1: [success.addressLine1, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                postCode: [success.postCode, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
            });
        }, function (error) { });
    };
    TutorAccountDetailsComponent.prototype.checkDateValid = function () {
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
    TutorAccountDetailsComponent.prototype.dateOfBirthInvalid = function () {
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
    TutorAccountDetailsComponent.prototype.getDateString = function () {
        return this.basicInfoForm.controls.dateOfBirthYear.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthMonth.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };
    ;
    TutorAccountDetailsComponent.prototype.submitBasicInfoForm = function () {
        var _this = this;
        this.basicInfoFormSubmitted = true;
        if (this.basicInfoForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            $('.loading').show();
            this.tutorsService.saveBasicInfo(__assign(__assign({}, this.basicInfoForm.getRawValue()), { dateOfBirth: new Date(Date.parse(this.getDateString())) }))
                .subscribe(function (success) {
                _this.toastr.success('Your account info has been updated');
                //this.resetForm();
            }, function (error) {
                $('.loading').hide();
                if (error.code == 400) {
                    _this.toastr.error('Please enter a valid date of birth');
                }
                else {
                    _this.toastr.error('We were unable to update your account info');
                }
            }, function () {
                _this.submitBankDetailsForm();
                _this.resetForm();
            });
        }
    };
    ;
    TutorAccountDetailsComponent.prototype.submitBankDetailsForm = function () {
        var _this = this;
        if (this.bankDetailsApplicable) {
            if (this.bankDetailsForm.touched == false)
                return;
            var bankDetailsFormData = this.bankDetailsForm.getRawValue();
            console.log("Saving bank details:", bankDetailsFormData);
            this.bankDetailsFormSubmitted = true;
            if (this.bankDetailsForm.valid) {
                this.tutorsService.saveBankDetail(bankDetailsFormData)
                    .subscribe(function (success) {
                    _this.toastr.success('Your bank info has been updated');
                }, function (err) { }, function () {
                    $('.loading').hide();
                });
            }
        }
    };
    ;
    TutorAccountDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-account-details',
            templateUrl: './tutor-account-details.component.html',
            styleUrls: ['./tutor-account-details.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.EnumsService])
    ], TutorAccountDetailsComponent);
    return TutorAccountDetailsComponent;
}());
exports.TutorAccountDetailsComponent = TutorAccountDetailsComponent;
//# sourceMappingURL=tutor-account-details.component.js.map