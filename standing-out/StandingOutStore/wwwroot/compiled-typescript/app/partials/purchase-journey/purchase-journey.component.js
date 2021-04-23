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
exports.PurchaseJourneyComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var index_1 = require("../../models/index");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var tick_modal_1 = require("../tick-modal/tick-modal");
var services_1 = require("../../services");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
Date.prototype.getWeek = function () {
    var dt = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
};
var PurchaseJourneyComponent = /** @class */ (function () {
    function PurchaseJourneyComponent(modalService, toastr, stripeService, formBuilder, coursesService, stripeCountrysService, promoCodeService, sessionInvitesService, location) {
        this.modalService = modalService;
        this.toastr = toastr;
        this.stripeService = stripeService;
        this.formBuilder = formBuilder;
        this.coursesService = coursesService;
        this.stripeCountrysService = stripeCountrysService;
        this.promoCodeService = promoCodeService;
        this.sessionInvitesService = sessionInvitesService;
        this.location = location;
        this.supportedPayout = new core_1.EventEmitter();
        this.payment = new index_1.Payment();
        this.basket = new index_1.Basket();
        this.toLoad = 2;
        this.loaded = 0;
        this.stripeCountrys = [];
        this.promoCode = '';
        this.paymentCard = null;
        this.promoCodeSubmitted = false;
        this.promoCodeDetails = null;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.showStripeError = false;
        this.stripeError = null;
        this.paymentMethodId = null;
        this.paymentIntentId = null;
        debugger;
    }
    Object.defineProperty(PurchaseJourneyComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    PurchaseJourneyComponent.prototype.getDefaultCountry = function () {
        for (var i = 0; i < this.stripeCountrys.length; i++) {
            if (this.stripeCountrys[i].name == 'United Kingdom') {
                return this.stripeCountrys[i].stripeCountryId;
            }
        }
        return null;
    };
    ;
    PurchaseJourneyComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            if (this.paymentCard == null) {
                this.setupPaymentForm();
            }
            $('.loading').hide();
        }
    };
    PurchaseJourneyComponent.prototype.getCard = function () {
        var _this = this;
        this.stripeService.getCard()
            .subscribe(function (success) {
            _this.paymentCard = success;
            _this.incrementLoad();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    PurchaseJourneyComponent.prototype.getStripeCountries = function () {
        var _this = this;
        this.stripeCountrysService.get()
            .subscribe(function (success) {
            _this.stripeCountrys = success;
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    PurchaseJourneyComponent.prototype.setupPaymentForm = function () {
        debugger;
        this.paymentForm = this.formBuilder.group({
            cardName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            stripeCountryId: [this.userStripeCountryId != null ? this.userStripeCountryId : this.getDefaultCountry(), [forms_1.Validators.required]],
            addressLine1: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]]
        });
        this.setupCardField();
    };
    ;
    PurchaseJourneyComponent.prototype.setupCardField = function () {
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
        }, 500);
    };
    ;
    PurchaseJourneyComponent.prototype.validatePromoCode = function () {
        var _this = this;
        $('.loading').show();
        this.promoCodeSubmitted = false;
        if (this.promoCode != null && this.promoCode != '') {
            this.promoCodeService.get(this.promoCode)
                .subscribe(function (success) {
                $('.loading').hide();
                _this.promoCodeDetails = success;
                _this.promoCodeSubmitted = true;
            }, function (error) {
                $('.loading').hide();
                console.log(error);
                _this.promoCodeDetails = null;
                _this.promoCodeSubmitted = true;
            });
        }
        else {
            $('.loading').hide();
            this.promoCodeDetails = null;
        }
    };
    ;
    PurchaseJourneyComponent.prototype.submitPayment = function () {
        debugger;
        var secondBetweenTwoDate = Math.abs((new Date(this.sessionDate).getTime() - new Date().getTime()) / 1000);
        if (secondBetweenTwoDate < 300) {
            this.toastr.warning('This lesson starts in less than 5 minutes so it cannot be purchased');
            return;
        }
        $('.loading').show();
        this.clearStripeError();
        if (((this.promoCode == null || this.promoCode == '') && this.promoCodeDetails == null) || (this.promoCodeDetails != null && this.promoCodeDetails.name == this.promoCode)) {
            this.paymentFormSubmitted = true;
            if (this.paymentCard == null) {
                if (this.paymentForm.valid) {
                    this.createPaymentCard();
                }
                else {
                    $('.loading').hide();
                }
            }
            else {
                // We have a card on record -> Using this
                this.confirmPayment(); // 1st call
            }
        }
        else {
            // Make sure the promo code entered is validated
            this.validatePromoCode();
        }
    };
    ;
    PurchaseJourneyComponent.prototype.createPaymentCard = function () {
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
    PurchaseJourneyComponent.prototype.paymentCardResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error.message);
        }
        else {
            this.paymentMethodId = result.paymentMethod.id;
            this.confirmPayment(); // 2nd call
        }
    };
    ;
    PurchaseJourneyComponent.prototype.clearStripeError = function () {
        this.showStripeError = false;
        this.stripeError = '';
    };
    ;
    PurchaseJourneyComponent.prototype.handleStripeError = function (error) {
        console.log('error', error);
        $('.loading').hide();
        this.showStripeError = true;
        this.stripeError = error;
        this.paymentIntentId = null;
    };
    ;
    PurchaseJourneyComponent.prototype.confirmPayment = function () {
        var _this = this;
        console.log(this.promoCodeDetails);
        debugger;
        // this.payment.classSessionId = this.classSessionId; 
        this.payment.paymentMethodId = this.paymentMethodId;
        this.payment.promoCode = this.promoCodeDetails == null ? null : this.promoCodeDetails.promoCodeId;
        this.payment.paymentIntentId = this.paymentIntentId;
        this.payment.addressLine1 = this.paymentForm != undefined ? this.paymentForm.controls.addressLine1.value : null;
        this.payment.cardName = this.paymentForm != undefined ? this.paymentForm.controls.cardName.value : null;
        this.payment.stripeCountryId = this.paymentForm != undefined ? this.paymentForm.controls.stripeCountryId.value : null;
        this.buildSampleBasket();
        this.basket.payment = this.payment;
        // this.stripeService.confirmSessionPayment(payment)
        if (this.basket.orderId == null) {
            console.log('Order Basket:', this.basket);
            this.stripeService.createBasketOrder(this.basket)
                .subscribe(function (success) {
                console.log('CreateBasketOrderResponse:', success);
                _this.handleCreateBasketOrderResponse(success);
            }, function (err) {
                $('.loading').hide();
                console.log('CreateBasketOrderResponse call error:', err.error);
                if (err.error.failResponses)
                    _this.mapErrorsToUi(err.error.failResponses);
                //this.handleStripeError(err.error);
            }, function () {
                //$('.loading').hide();
            });
        }
        else {
            console.log('Payment Basket:', this.basket);
            this.stripeService.confirmBasketPayment(this.basket)
                .subscribe(function (success) {
                _this.handleServerResponse(success);
            }, function (err) {
                _this.handleStripeError(err.error);
                _this.toastr.error("Sorry, payment failed..");
                $('.loading').hide();
            }, function () { $('.loading').hide(); });
        }
    };
    ;
    // Simulate UI adding items to basket.
    // TODO: This needs to be implemented in Course purchase screen...
    PurchaseJourneyComponent.prototype.buildSampleBasket = function () {
        //debugger;
        if (this.basket.basketItems == null || this.basket.basketItems.length == 0) {
            this.basket.basketItems = [];
            // Build a basket Item and add to basket.
            var bi = new index_1.BasketItem();
            bi.courseId = this.courseId; //'1802d6db-fe4c-4750-e662-08d874122c86'; // DA8E3A3A-B2F4-4503-ACB9-08D866E738BF';
            if (bi.courseInvites == null)
                bi.courseInvites = [];
            //This is for Courses created by student and invite friend or groups(this is optional)
            //bi.courseInvites.push(new CourseInvite('2utoring_student1@maildrop.cc'));
            //bi.courseInvites.push(new CourseInvite('2utoring_student2@maildrop.cc'));
            this.basket.basketItems.push(bi);
        }
    };
    PurchaseJourneyComponent.prototype.handleCreateBasketOrderResponse = function (response) {
        if (response.failResponses.length == 0) {
            this.basket.orderId = response.orderId;
            this.confirmPayment();
        }
        else {
            this.mapErrorsToUi(response.failResponses);
        }
    };
    PurchaseJourneyComponent.prototype.mapErrorsToUi = function (failResponses) {
        this.toastr.error(failResponses[0].Value);
        $('.loading').hide();
        // Implement as per UI design TBC
    };
    PurchaseJourneyComponent.prototype.handleServerResponse = function (fetchResult) {
        var _this = this;
        this.paymentIntentId = fetchResult.paymentIntentId;
        if (fetchResult.requiresAction) {
            $('.loading').hide();
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(function (response) {
                $('.loading').show();
                _this.cardActionResponse(response);
            });
        }
        else {
            this.paymentSuccessful();
        }
    };
    ;
    PurchaseJourneyComponent.prototype.cardActionResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error.message);
        }
        else {
            this.confirmPayment(); // 3rd call
        }
    };
    ;
    PurchaseJourneyComponent.prototype.paymentSuccessful = function () {
        var _this = this;
        $('.loading').hide();
        // Pop up just has a redirect in it to the timeables
        var navTo = '/my/timetable';
        var modalRef = this.modalService.open(tick_modal_1.TickModal, { size: 'md' });
        modalRef.componentInstance.title = 'Lesson purchased!';
        modalRef.componentInstance.navTo = '/my/timetable';
        modalRef.componentInstance.button = 'View your timetable';
        //clear localstorage
        if (localStorage.getItem("courseId") != null) {
            var courseId = localStorage.getItem("courseId");
            var myEmailsToInvite = JSON.parse(localStorage.getItem("inviteEmailArray"));
            if ((myEmailsToInvite) && myEmailsToInvite.length > 0) {
                $('.loading').show();
                this.sessionInvitesService.createMultiple(myEmailsToInvite)
                    .subscribe(function (success) {
                    if (success != '') {
                        _this.toastr.success('Invitation sent successfully!.');
                    }
                    else {
                        _this.toastr.warning('No new invitation sent!');
                    }
                    $('.loading').hide();
                }, function (error) { });
            }
            this.coursesService.courseNotification(courseId).subscribe(function (success) {
                console.log(success);
            });
        }
        localStorage.clear();
        this.getDaysDifference();
        //handle the response
        modalRef.result.then(function (result) {
        }, function (reason) {
            window.location.href = navTo;
        });
    };
    ;
    PurchaseJourneyComponent.prototype.removeCard = function () {
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
    PurchaseJourneyComponent.prototype.dateOfBirthInvalid = function () {
        //debugger;
        if (this.under18 == null) {
            return false;
        }
        else if (this.under18) {
            var dateOfBirth = new Date(this.dateOfBirth);
            var dateToMatch = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
            if (dateOfBirth < dateToMatch) {
                return true;
            }
        }
        else {
            var dateOfBirth = new Date(this.dateOfBirth);
            var dateToMatch = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 17, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
            if (dateOfBirth > dateToMatch) {
                return true;
            }
        }
        return false;
    };
    ;
    PurchaseJourneyComponent.prototype.back = function () {
        this.location.back();
    };
    ;
    PurchaseJourneyComponent.prototype.ngOnInit = function () {
        debugger;
        $('.loading').show();
        this.getCard();
        this.getStripeCountries();
    };
    ;
    PurchaseJourneyComponent.prototype.ngOnChanges = function (changes) {
        debugger;
        if (changes.sessionDate) {
            this.sessionDate = changes.sessionDate.currentValue;
        }
        if (!this.card) {
            debugger;
            this.setupCardField();
        }
        this.getCard();
        this.getStripeCountries();
    };
    PurchaseJourneyComponent.prototype.getDaysDifference = function () {
        debugger;
        var timestamp1 = new Date(this.sessionDate).getTime();
        //let timestamp2 = new Date().getTime();
        new Date(this.sessionDate).getTime();
        var currentWeekOfTimeTable = new Date();
        var lessonDate = new Date(timestamp1); // 2013, 25 April
        var weekOffset = (lessonDate.getWeek() - currentWeekOfTimeTable.getWeek());
        //let weekOffset: any = lessonDate.getWeek();
        //console.log(myDate.getWeek());
        //var difference = timestamp1 - timestamp2;
        //let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        //let weekOffset: any = Math.ceil(daysDifference / 7);
        localStorage.setItem('week', weekOffset);
        //return daysDifference;
    };
    PurchaseJourneyComponent.prototype.onCountryChange = function (id) {
        debugger;
        var newId = id.split(':');
        var selectedValue = this.stripeCountrys.filter(function (t) { return t.stripeCountryId == newId[1].trim(); });
        if (selectedValue[0].supportedPayout) {
            this.supportedPayout.emit(true);
        }
        else {
            this.supportedPayout.emit(false);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PurchaseJourneyComponent.prototype, "courseId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], PurchaseJourneyComponent.prototype, "under18", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Date)
    ], PurchaseJourneyComponent.prototype, "dateOfBirth", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PurchaseJourneyComponent.prototype, "sessionDate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PurchaseJourneyComponent.prototype, "currentStep", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PurchaseJourneyComponent.prototype, "supportedPayout", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PurchaseJourneyComponent.prototype, "userStripeCountryId", void 0);
    PurchaseJourneyComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-journey',
            templateUrl: './purchase-journey.component.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, ngx_toastr_1.ToastrService,
            services_1.StripeService, forms_1.FormBuilder, services_1.CoursesService,
            services_1.StripeCountrysService, services_1.PromoCodeService,
            services_1.SessionInvitesService,
            common_1.Location])
    ], PurchaseJourneyComponent);
    return PurchaseJourneyComponent;
}());
exports.PurchaseJourneyComponent = PurchaseJourneyComponent;
//# sourceMappingURL=purchase-journey.component.js.map