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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsPayoutComponent = void 0;
var core_1 = require("@angular/core");
var $ = require("jquery");
var ngx_toastr_1 = require("ngx-toastr");
var services_1 = require("../../../services");
var forms_1 = require("@angular/forms");
var SettingsPayoutComponent = /** @class */ (function () {
    function SettingsPayoutComponent(toastr, stripeService, formBuilder, usersService) {
        var _a;
        this.toastr = toastr;
        this.stripeService = stripeService;
        this.formBuilder = formBuilder;
        this.usersService = usersService;
        this.alertMessage = null;
        this.title = title;
        this.stripeConnectAccountId = stripeConnectAccountId;
        this.stripeConnectBankAccountId = stripeConnectBankAccountId;
        this.stKey = stKey;
        this.tutorId = tutorId;
        this.companyId = companyId;
        this.error = error;
        this.success = success; //needs to be nullable 
        this.stripeBankAccounts = [];
        this.showReloadList = false;
        this.companyLoginMode = false;
        this.userPayoutStatus = false;
        this.toLoad = this.stripeConnectAccountId !== undefined && this.stripeConnectAccountId != null && this.stripeConnectAccountId != '' && ((_a = this.alertMessage) === null || _a === void 0 ? void 0 : _a.idVerificationStatus) == 'Approved' && (success == true || success === undefined) ? 1 : 0;
        this.loaded = 0;
        this.bankForm = this.formBuilder.group({});
        this.bankFormSubmitted = false;
    }
    Object.defineProperty(SettingsPayoutComponent.prototype, "bankFormControls", {
        get: function () { return this.bankForm.controls; },
        enumerable: false,
        configurable: true
    });
    SettingsPayoutComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    SettingsPayoutComponent.prototype.ngOnInit = function () {
        debugger;
        if (window.location.pathname == "/admin/settings/payout") {
            this.companyLoginMode = true;
        }
        this.setupForm();
        this.getUserAlertMessage();
        this.getUserPayoutResponse();
        if (this.error == true) {
            this.toastr.error("We have been unable to setup your account");
        }
        if (this.success == true) {
            this.toastr.success("Your account has been successfully setup");
        }
        if (this.stripeConnectAccountId !== undefined && this.stripeConnectAccountId != null && this.stripeConnectAccountId != '') {
            this.getBankAccounts();
        }
    };
    ;
    SettingsPayoutComponent.prototype.getBankAccounts = function () {
        var _this = this;
        $('.loading').show();
        this.stripeService.getMyBankAccounts().subscribe(function (success) {
            _this.stripeBankAccounts = success;
            _this.setupForm();
            _this.incrementLoad();
        }, function (err) {
            _this.toastr.error("We were unable to load your bank accounts. Please try again.");
        });
    };
    ;
    SettingsPayoutComponent.prototype.payoutRedirect = function () {
        if (this.companyLoginMode) {
            window.location.href = '/admin/settings/payoutredirect';
        }
        else {
            window.location.href = '/tutor/settings/payoutredirect';
        }
    };
    ;
    SettingsPayoutComponent.prototype.setupForm = function () {
        this.bankForm = this.formBuilder.group({
            stripeConnectBankAccountId: [this.stripeConnectBankAccountId, [forms_1.Validators.required]],
        });
    };
    ;
    SettingsPayoutComponent.prototype.save = function () {
        var _this = this;
        this.bankFormSubmitted = true;
        if (this.stripeBankAccounts.findIndex(function (o) { return o.id == _this.bankForm.controls.stripeConnectBankAccountId.value; }) == -1) {
            stripeConnectBankAccountId = '';
            this.stripeConnectBankAccountId = '';
            this.bankForm.controls.stripeConnectBankAccountId.setValue('');
        }
        if (this.bankForm.valid) {
            $('.loading').show();
            this.stripeService.patchBankId(this.bankForm.controls.stripeConnectBankAccountId.value).subscribe(function (success) {
                _this.toastr.success("Your account info has been updated");
                $('.loading').hide();
            }, function (err) {
                _this.toastr.error("We were unable to update your account info");
            });
        }
    };
    ;
    SettingsPayoutComponent.prototype.manageAccount = function () {
        var _this = this;
        $('.loading').show();
        this.stripeService.getLoginLink().subscribe(function (success) {
            _this.showReloadList = true;
            window.open(success);
            _this.incrementLoad();
        }, function (err) {
            _this.toastr.error("Sorry this service is currently unavailable");
        });
    };
    SettingsPayoutComponent.prototype.getUserPayoutResponse = function () {
        var _this = this;
        if (this.tutorId != null) {
            this.usersService.getPayoutResponseFromStripe(stripeConnectAccountId, stKey)
                .subscribe(function (success) {
                _this.userPayoutStatus = success.payouts_enabled;
                if (_this.userPayoutStatus) {
                    debugger;
                    var obj = {
                        tutorId: _this.tutorId,
                        companyId: _this.companyId,
                        status: _this.userPayoutStatus
                    };
                    _this.usersService.updateIdVerificationStautsForTutor(obj)
                        .subscribe(function (success) { }, function (error) {
                    });
                }
            }, function (error) {
            });
        }
        if (this.companyId != null) {
            this.usersService.getPayoutResponseFromStripe(stripeConnectAccountId, stKey)
                .subscribe(function (success) {
                _this.userPayoutStatus = success.payouts_enabled;
                if (_this.userPayoutStatus) {
                    var obj = {
                        tutorId: _this.tutorId,
                        companyId: _this.companyId,
                        status: _this.userPayoutStatus
                    };
                    _this.usersService.updateIdVerificationStautsForCompany(obj)
                        .subscribe(function (success) { }, function (error) {
                    });
                }
            }, function (error) {
            });
        }
    };
    SettingsPayoutComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    SettingsPayoutComponent = __decorate([
        core_1.Component({
            selector: 'app-settings-payout',
            templateUrl: './settings-payout.component.html'
        }),
        __metadata("design:paramtypes", [ngx_toastr_1.ToastrService, services_1.StripeService, forms_1.FormBuilder, services_1.UsersService])
    ], SettingsPayoutComponent);
    return SettingsPayoutComponent;
}());
exports.SettingsPayoutComponent = SettingsPayoutComponent;
//# sourceMappingURL=settings-payout.component.js.map