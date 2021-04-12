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
exports.CompanyAccountDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var service_helper_1 = require("../../../helpers/service.helper");
var ngx_toastr_1 = require("ngx-toastr");
var $ = require("jquery");
var company_service_1 = require("../../../services/company.service");
var CompanyAccountDetailsComponent = /** @class */ (function () {
    function CompanyAccountDetailsComponent(fb, toastr, companyService, enumsService) {
        this.fb = fb;
        this.toastr = toastr;
        this.companyService = companyService;
        this.enumsService = enumsService;
        this.serviceHelper = new service_helper_1.ServiceHelper();
        this.companyId = undefined;
        this.companyFirstName = '';
        this.CompanyBasicInfoFormSubmitted = false;
    }
    Object.defineProperty(CompanyAccountDetailsComponent.prototype, "basicInfoFormCompanyControls", {
        get: function () { return this.companyBasicInfoForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    CompanyAccountDetailsComponent.prototype.ngOnInit = function () {
        this.buildBasicInfoForm();
        this.getBasicInfo();
    };
    CompanyAccountDetailsComponent.prototype.buildBasicInfoForm = function () {
        this.companyBasicInfoForm = this.fb.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            telephoneNumber: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [''],
            mobileNumber: ['', [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            companyName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            companyRegistrationNumber: ['', [forms_1.Validators.maxLength(20)]],
            addressLine1: ['', [forms_1.Validators.required]],
            addressLine2: ['', [forms_1.Validators.required]],
            country: ['', [forms_1.Validators.required]],
            companyPostcode: ['', [forms_1.Validators.required]],
            companyTelephoneNumber: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            companyEmail: [''],
            companyMobileNumber: ['', [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            termsAndConditionsAccepted: [true],
            marketingAccepted: [false, []],
        });
    };
    CompanyAccountDetailsComponent.prototype.getBasicInfo = function () {
        var _this = this;
        this.companyService.getBasicInfo()
            .subscribe(function (success) {
            _this.CompanyBasicInfoFormSubmitted = false;
            _this.companyBasicInfoForm = _this.fb.group({
                firstName: [success.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                lastName: [success.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                telephoneNumber: [success.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                email: [{ value: success.email, disabled: true }],
                mobileNumber: [success.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                companyName: [success.companyName, [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                companyRegistrationNumber: [success.companyRegistrationNumber, [forms_1.Validators.maxLength(20)]],
                //companyAddress: [success.companyAddress, [Validators.required]],
                addressLine1: [success.addressLine1, [forms_1.Validators.required]],
                addressLine2: [success.addressLine2, [forms_1.Validators.required]],
                country: [success.country, [forms_1.Validators.required]],
                companyPostcode: [success.companyPostcode, [forms_1.Validators.required]],
                companyTelephoneNumber: [success.companyTelephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                companyEmail: [success.companyEmail],
                companyMobileNumber: [success.companyMobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
                termsAndConditionsAccepted: [true],
                marketingAccepted: [success.marketingAccepted, []],
            });
        }, function (error) {
            console.log('Get basic info failed.. in error case');
        }, function () {
            $('.loading').hide();
        });
    };
    CompanyAccountDetailsComponent.prototype.submitCompanyBasicInfoForm = function () {
        var _this = this;
        //debugger;
        this.CompanyBasicInfoFormSubmitted = true;
        if (this.companyBasicInfoForm.valid) {
            $('.loading').show();
            var companyRegisterBasicInfo = __assign({}, this.companyBasicInfoForm.getRawValue());
            //companyRegisterBasicInfo.stripePlanId = this.stripePlanId;
            this.companyService.saveCompanyBasicInfo(companyRegisterBasicInfo)
                .subscribe(function (success) {
                _this.toastr.success('Company details saved sucessfully!');
                // TODO redirect to where?
            }, function (error) {
                _this.toastr.error('Something went wrong');
            }, function () {
                $('.loading').hide();
            });
        }
    };
    ;
    CompanyAccountDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-company-account-details',
            templateUrl: './company-account-details.component.html',
            styleUrls: ['./company-account-details.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, ngx_toastr_1.ToastrService,
            company_service_1.CompanyService,
            services_1.EnumsService])
    ], CompanyAccountDetailsComponent);
    return CompanyAccountDetailsComponent;
}());
exports.CompanyAccountDetailsComponent = CompanyAccountDetailsComponent;
//# sourceMappingURL=company-account-details.component.js.map