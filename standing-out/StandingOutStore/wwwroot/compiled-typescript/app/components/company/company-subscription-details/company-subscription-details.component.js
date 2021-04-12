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
exports.CompanySubscriptionDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var CompanySubscriptionDetailsComponent = /** @class */ (function () {
    function CompanySubscriptionDetailsComponent(fb, companysService, stripeCountrysService, toastrService) {
        this.fb = fb;
        this.companysService = companysService;
        this.stripeCountrysService = stripeCountrysService;
        this.toastrService = toastrService;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.stripeCountrys = [];
        this.paymentFormSubmitted = false;
        this.showStripeError = false;
        this.stripeError = null;
    }
    Object.defineProperty(CompanySubscriptionDetailsComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    CompanySubscriptionDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.companysService.getMy()
            .subscribe(function (success) {
            _this.company = success;
            _this.setUpPaymentForm();
            _this.loadPaymentMethod();
            _this.loadSubscription();
        }, function (error) {
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.loadSubscription = function () {
        var _this = this;
        this.companysService.getSubscriptionByCompany(this.company.companyId)
            .subscribe(function (success) {
            _this.subscription = success;
        }, function (error) {
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.loadPaymentMethod = function () {
        var _this = this;
        this.companysService.getDefaultPaymentMethodByCompany(this.company.companyId)
            .subscribe(function (success) {
            _this.paymentCard = success;
        }, function (error) {
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.setUpPaymentForm = function () {
        var _this = this;
        this.stripeCountrysService.get()
            .subscribe(function (countrySuccess) {
            _this.stripeCountrys = countrySuccess;
            _this.paymentFormSubmitted = false;
            _this.paymentForm = _this.fb.group({
                companyId: [_this.company.companyId],
                stripePlanId: [_this.company.stripePlanId, [forms_1.Validators.required]],
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
            _this.setupCardField();
        }, function (error) {
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.submitPaymentForm = function () {
        this.paymentFormSubmitted = true;
        console.log(this.paymentForm);
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.createPaymentCard();
        }
        else {
            console.log("Errors:", this.paymentForm.errors);
            this.toastrService.error("Sorry, cannot update right now.. Please retry later.");
        }
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.setupCardField = function () {
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
    CompanySubscriptionDetailsComponent.prototype.createPaymentCard = function () {
        var _this = this;
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(function (response) {
            console.log("paymentCardResponse", response);
            _this.paymentCardResponse(response);
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.paymentCardResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        }
        else {
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.confirmSubscriptionSend = function () {
        var _this = this;
        $('.loading').show();
        this.companysService.updatePayment(this.paymentForm.getRawValue())
            .subscribe(function (success) {
            _this.handleServerResponse(success);
            $('.loading').hide();
        }, function (err) {
            _this.handleStripeError(err.error);
            $('.loading').hide();
        });
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.handleServerResponse = function (fetchResult) {
        var _this = this;
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(function (response) {
                _this.cardActionResponse(response);
            });
        }
        else {
            this.toastrService.success('Success');
            this.ngOnInit();
        }
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.cardActionResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
        }
        else {
            this.confirmSubscriptionSend();
        }
    };
    ;
    CompanySubscriptionDetailsComponent.prototype.handleStripeError = function (error) {
        this.showStripeError = true;
        this.stripeError = error;
        this.setupCardField();
    };
    ;
    CompanySubscriptionDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-company-subscription-details',
            templateUrl: './company-subscription-details.component.html',
            styleUrls: ['./company-subscription-details.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, services_1.CompanyService, services_1.StripeCountrysService, ngx_toastr_1.ToastrService])
    ], CompanySubscriptionDetailsComponent);
    return CompanySubscriptionDetailsComponent;
}());
exports.CompanySubscriptionDetailsComponent = CompanySubscriptionDetailsComponent;
//# sourceMappingURL=company-subscription-details.component.js.map