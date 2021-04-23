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
exports.PaymentCardComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../services");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var PaymentCardComponent = /** @class */ (function () {
    function PaymentCardComponent(stripeService, formBuilder, stripeCountrysService) {
        this.stripeService = stripeService;
        this.formBuilder = formBuilder;
        this.stripeCountrysService = stripeCountrysService;
        this.stripeCountrys = [];
        this.paymentCard = null;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.showStripeError = false;
        this.stripeError = null;
        this.paymentMethodId = null;
    }
    Object.defineProperty(PaymentCardComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    PaymentCardComponent.prototype.submitPaymentForm = function () {
        var _this = this;
        debugger;
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.stripe.createPaymentMethod('card', this.card, {
                billing_details: {
                    name: this.paymentForm.controls.cardName.value,
                    address: {
                        line1: this.paymentForm.controls.addressLine1.value
                    }
                }
            }).then(function (response) {
                if (response.error) {
                    _this.showStripeError = true;
                    _this.stripeError = response.error;
                    $('.loading').hide();
                }
                else {
                    _this.stripeService.connectPaymentMethod({ paymentMethodId: response.paymentMethod.id, cardName: _this.paymentForm.controls.cardName.value, stripeCountryId: _this.paymentForm.controls.stripeCountryId.value, userType: 'Student' })
                        .subscribe(function (success) {
                        _this.paymentCard = success;
                        _this.showStripeError = false;
                        _this.stripeError = null;
                        $('.loading').hide();
                    }, function (error) {
                        _this.showStripeError = true;
                        _this.stripeError = 'There was an error adding your card. Please check your details and try again.';
                        $('.loading').hide();
                    });
                }
            });
        }
    };
    ;
    PaymentCardComponent.prototype.getCard = function () {
        var _this = this;
        this.stripeService.getCard()
            .subscribe(function (success) {
            _this.paymentCard = success;
            if (_this.paymentCard == null) {
                _this.setupPaymentForm();
            }
        }, function (error) {
            console.log(error);
        });
    };
    ;
    PaymentCardComponent.prototype.getStripeCountries = function () {
        var _this = this;
        this.stripeCountrysService.get()
            .subscribe(function (success) {
            _this.stripeCountrys = success;
        }, function (error) {
        });
    };
    ;
    PaymentCardComponent.prototype.setupPaymentForm = function () {
        this.paymentForm = this.formBuilder.group({
            cardName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            stripeCountryId: [null, [forms_1.Validators.required]],
            addressLine1: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]]
        });
        this.setupCardField();
    };
    ;
    PaymentCardComponent.prototype.setupCardField = function () {
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
    PaymentCardComponent.prototype.removeCard = function () {
        var _this = this;
        this.stripeService.deleteCard(this.paymentCard.paymentMethodId)
            .subscribe(function (success) {
            _this.paymentCard = null;
            _this.setupPaymentForm();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    PaymentCardComponent.prototype.ngOnInit = function () {
        this.getCard();
        this.getStripeCountries();
    };
    ;
    PaymentCardComponent = __decorate([
        core_1.Component({
            selector: 'app-payment-card',
            templateUrl: './payment-card.component.html'
        }),
        __metadata("design:paramtypes", [services_1.StripeService, forms_1.FormBuilder,
            services_1.StripeCountrysService])
    ], PaymentCardComponent);
    return PaymentCardComponent;
}());
exports.PaymentCardComponent = PaymentCardComponent;
//# sourceMappingURL=payment-card.component.js.map