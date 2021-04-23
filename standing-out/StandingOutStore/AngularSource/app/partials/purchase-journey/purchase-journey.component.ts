import { Component, Input,Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { StripeCard, StripeCountry, PromoCode, Payment, Basket, BasketItem, CourseInvite, CreateBasketOrderResponse } from '../../models/index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TickModal } from '../tick-modal/tick-modal';
import { StripeService, StripeCountrysService, PromoCodeService, CoursesService, SessionInvitesService } from '../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

declare var Stripe: Function;
declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function () {
    let dt:any = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
};

@Component({
    selector: 'app-purchase-journey',
    templateUrl: './purchase-journey.component.html'
})

export class PurchaseJourneyComponent {
    constructor(private modalService: NgbModal, private toastr: ToastrService,
        private stripeService: StripeService, private formBuilder: FormBuilder, private coursesService: CoursesService,
        private stripeCountrysService: StripeCountrysService, private promoCodeService: PromoCodeService,
        private sessionInvitesService: SessionInvitesService,
        private location: Location) { debugger; }

    @Input() courseId: string;
    //@Input() classSessionId: string;
    @Input() under18: boolean;
    @Input() dateOfBirth: Date;
    @Input() sessionDate: any;
    @Input() currentStep: any;
    @Output() supportedPayout = new EventEmitter<boolean>();
    @Input() userStripeCountryId: any; 
    payment: Payment = new Payment();
    basket: Basket = new Basket();

    toLoad: number = 2;
    loaded: number = 0;

    stripeCountrys: StripeCountry[] = [];
    promoCode: string = '';
    paymentCard: StripeCard = null;
    promoCodeSubmitted: boolean = false;
    promoCodeDetails: PromoCode = null;

    stripe: any = Stripe(environment.stripeKey);
    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;

    paymentMethodId: string = null;
    paymentIntentId: string = null;

    paymentForm: FormGroup;
    paymentFormSubmitted: boolean;
    get paymentFormControls() { return this.paymentForm.controls; };

    getDefaultCountry(): string {
        for (var i = 0; i < this.stripeCountrys.length; i++) {
            if (this.stripeCountrys[i].name == 'United Kingdom') {
                return this.stripeCountrys[i].stripeCountryId;
            }
        }
        return null;
    };

    incrementLoad(): void {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            if (this.paymentCard == null) {
                this.setupPaymentForm();
            }
            $('.loading').hide();
        }
    }

    getCard(): void {
        this.stripeService.getCard()
            .subscribe(success => {
                this.paymentCard = success;
                this.incrementLoad();
            }, error => {
                console.log(error);
            });
    };

    getStripeCountries(): void {
        this.stripeCountrysService.get()
            .subscribe(success => {
                this.stripeCountrys = success;
                this.incrementLoad();
            }, error => {
            });
    };


    setupPaymentForm(): void {
        debugger;
        this.paymentForm = this.formBuilder.group({
            cardName: ['', [Validators.required, Validators.maxLength(250)]],
            stripeCountryId: [this.userStripeCountryId!=null? this.userStripeCountryId: this.getDefaultCountry(), [Validators.required]],
            addressLine1: ['', [Validators.required, Validators.maxLength(250)]]
        });
        this.setupCardField();
    };

    setupCardField(): void {
        setTimeout(() => {
            var elements = this.stripe.elements();
            this.card = elements.create('card');
            this.card.mount('#card-info');
            this.card.addEventListener('change', event => {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.style.display = 'block';
                    displayError.textContent = event.error.message;
                } else {
                    displayError.style.display = 'none';
                    displayError.textContent = '';
                }
            });
        }, 500);
    };

    validatePromoCode(): void {
        $('.loading').show();
        this.promoCodeSubmitted = false;
        if (this.promoCode != null && this.promoCode != '') {
            this.promoCodeService.get(this.promoCode)
                .subscribe(success => {
                    $('.loading').hide();
                    this.promoCodeDetails = success;
                    this.promoCodeSubmitted = true;
                }, error => {
                    $('.loading').hide();
                    console.log(error);
                    this.promoCodeDetails = null;
                    this.promoCodeSubmitted = true;
                });
        }
        else {
            $('.loading').hide();
            this.promoCodeDetails = null;
        }
    };

    submitPayment(): void {
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

    createPaymentCard(): void {
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(response => {
            this.paymentCardResponse(response);
        });
    };
    paymentCardResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error.message);
        } else {
            this.paymentMethodId = result.paymentMethod.id;
            this.confirmPayment(); // 2nd call
        }
    };
    clearStripeError(): void {
        this.showStripeError = false;
        this.stripeError = '';
    };
    handleStripeError(error: string): void {
        console.log('error', error);
        $('.loading').hide();
        this.showStripeError = true;
        this.stripeError = error;
        this.paymentIntentId = null;
    };
    confirmPayment(): void { 
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
                .subscribe(success => {
                    console.log('CreateBasketOrderResponse:', success);
                    this.handleCreateBasketOrderResponse(success);
                }, err => {
                     $('.loading').hide();
                    console.log('CreateBasketOrderResponse call error:', err.error);
                    if (err.error.failResponses) this.mapErrorsToUi(err.error.failResponses);
                    //this.handleStripeError(err.error);
                }, () => { 
            //$('.loading').hide();
 });
        }
        else {
            console.log('Payment Basket:', this.basket);
            this.stripeService.confirmBasketPayment(this.basket)
                .subscribe(success => {
                    this.handleServerResponse(success);
                }, err => {
                    this.handleStripeError(err.error);
                    this.toastr.error("Sorry, payment failed..");
                    $('.loading').hide();
                 }, () => { $('.loading').hide(); });
        }
    };

    // Simulate UI adding items to basket.
    // TODO: This needs to be implemented in Course purchase screen...
    buildSampleBasket(): void {
        //debugger;
        if (this.basket.basketItems == null || this.basket.basketItems.length == 0) {
            this.basket.basketItems = [];

            // Build a basket Item and add to basket.
            let bi = new BasketItem();
            bi.courseId = this.courseId; //'1802d6db-fe4c-4750-e662-08d874122c86'; // DA8E3A3A-B2F4-4503-ACB9-08D866E738BF';
            if (bi.courseInvites == null) bi.courseInvites = [];

            //This is for Courses created by student and invite friend or groups(this is optional)
            //bi.courseInvites.push(new CourseInvite('2utoring_student1@maildrop.cc'));
            //bi.courseInvites.push(new CourseInvite('2utoring_student2@maildrop.cc'));

            this.basket.basketItems.push(bi);
        }
    }

    handleCreateBasketOrderResponse(response: CreateBasketOrderResponse): void {
        if (response.failResponses.length == 0) {
            this.basket.orderId = response.orderId;
            this.confirmPayment();
        } else {
            this.mapErrorsToUi(response.failResponses);
        }
    }

    mapErrorsToUi(failResponses): void {
        this.toastr.error(failResponses[0].Value);
        $('.loading').hide();
        // Implement as per UI design TBC
    }

    handleServerResponse(fetchResult): void {
        this.paymentIntentId = fetchResult.paymentIntentId;
        if (fetchResult.requiresAction) {
            $('.loading').hide();
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(response => {
                $('.loading').show();
                this.cardActionResponse(response);
            });
        } else {
            this.paymentSuccessful();
        }
    };
    cardActionResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error.message);
        } else {
            this.confirmPayment(); // 3rd call
        }
    };

    paymentSuccessful(): void {
        $('.loading').hide();
        // Pop up just has a redirect in it to the timeables
        let navTo = '/my/timetable';
        const modalRef = this.modalService.open(TickModal, { size: 'md' });
        modalRef.componentInstance.title = 'Lesson purchased!';
        modalRef.componentInstance.navTo = '/my/timetable';
        modalRef.componentInstance.button = 'View your timetable';

        //clear localstorage
        if (localStorage.getItem("courseId") != null) {
            let courseId = localStorage.getItem("courseId");
                let myEmailsToInvite = JSON.parse(localStorage.getItem("inviteEmailArray"));
            if ((myEmailsToInvite) && myEmailsToInvite.length > 0) {
                    $('.loading').show();
                    this.sessionInvitesService.createMultiple(myEmailsToInvite)
                        .subscribe(
                            success => {
                                if (success != '') {
                                    this.toastr.success('Invitation sent successfully!.');
                                } else {
                                    this.toastr.warning('No new invitation sent!');
                                }
                                $('.loading').hide();
                            },
                            error => { });
                }

                this.coursesService.courseNotification(courseId).subscribe(success => {
                console.log(success);
            });
        }

        localStorage.clear();

        this.getDaysDifference();

        //handle the response
        modalRef.result.then((result) => {
        }, (reason) => {
            window.location.href = navTo;
        });
    };

    removeCard(): void {
        this.stripeService.deleteCard(this.paymentCard.paymentMethodId)
            .subscribe(success => {
                this.paymentCard = null;
                this.setupPaymentForm();
            }, error => {
                console.log(error);
            });
    };

    dateOfBirthInvalid(): boolean {
        //debugger;
        if (this.under18 == null) {
            return false;
        }
        else if (this.under18) {
            let dateOfBirth: Date = new Date(this.dateOfBirth);
            let dateToMatch: Date = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
            if (dateOfBirth < dateToMatch) {
                return true;
            }
        }
        else {
            let dateOfBirth: Date = new Date(this.dateOfBirth);
            let dateToMatch: Date = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 17, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
            if (dateOfBirth > dateToMatch) {
                return true;
            }
        }
        return false;
    };

    back(): void {
        this.location.back();
    };

    ngOnInit() {
        debugger;
        $('.loading').show();
        this.getCard();
        this.getStripeCountries();
    };

    ngOnChanges(changes: SimpleChanges) {
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
    }


    getDaysDifference() {
        debugger;
        let timestamp1 = new Date(this.sessionDate).getTime();
        //let timestamp2 = new Date().getTime();
        new Date(this.sessionDate).getTime();
        let currentWeekOfTimeTable = new Date();
        let lessonDate = new Date(timestamp1); // 2013, 25 April

        let weekOffset: any = (lessonDate.getWeek() - currentWeekOfTimeTable.getWeek());

        //let weekOffset: any = lessonDate.getWeek();
         //console.log(myDate.getWeek());

        //var difference = timestamp1 - timestamp2;
        //let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        //let weekOffset: any = Math.ceil(daysDifference / 7);
         localStorage.setItem('week', weekOffset);
        //return daysDifference;
    }

    onCountryChange(id: string) {
        debugger;
        var newId = id.split(':');
        let selectedValue = this.stripeCountrys.filter(t => t.stripeCountryId == newId[1].trim());
        if (selectedValue[0].supportedPayout) {
            this.supportedPayout.emit(true);
        }
        else {
            this.supportedPayout.emit(false);
        }

        
    }
}
