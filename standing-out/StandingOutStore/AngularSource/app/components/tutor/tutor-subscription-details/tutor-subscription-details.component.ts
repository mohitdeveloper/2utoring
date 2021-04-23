import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TutorsService, StripeCountrysService, StripePlansService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { StripeCountry, Tutor, StripeCard, StripeSubscription, StripePlan, Subscription } from '../../../models'; 
import { DbsCheckDialog } from './dbscheck-dialog.component';
import { MatDialog } from '@angular/material/dialog';


declare var Stripe: Function;

@Component({
    selector: 'app-tutor-subscription-details',
    templateUrl: './tutor-subscription-details.component.html',
    styleUrls: ['./tutor-subscription-details.component.css']
})
export class TutorSubscriptionDetailsComponent implements OnInit {

    stripe: any = Stripe(environment.stripeKey);
    tutor: Tutor;
    paymentCard: StripeCard;
    subscription: StripeSubscription;
    stripeCountrys: StripeCountry[] = [];
    paymentForm: FormGroup;
    paymentFormSubmitted: boolean = false;
    get paymentFormControls() { return this.paymentForm.controls };
    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;
    stripePlans: StripePlan[];
    tutorsPlans: [];
    buttonText: string = 'Update changes';
    stripeCountryId: string;
    //ProfileApprovalCheckNoFee: boolean;
    //DBSApprovalCheckNoFee: boolean;
    //ProfileApprovalCheckStarter: boolean;
    //DBSApprovalCheckStarter: boolean;
    //ProfileApprovalCheckPro: boolean;
    //DBSApprovalCheckPro: boolean;
    //ProfileApprovalSelectedPlan: boolean;
    //DBSApprovalSelectedPlan: boolean;

    //updateSubscriptionStatus: string = 'Not Set';
    //updateSubscriptionSelectedStatus: string;
    //currentStatusForTuorDbsApprovalAndProfileApproval: number = null;
    //selectedSubscriptionId: string;
    //mySubscriptionUpdateObj: {};
    //subscriptionSelected: boolean = false;

    mySubscriptionUpdateObj: {};
    selectedStripePlanId: string;
    selectedSubscriptionId: string;
    currentStripePlanId: string;


    constructor(public dialog: MatDialog, private fb: FormBuilder, private tutorsService: TutorsService, private stripeCountrysService: StripeCountrysService, private toastrService: ToastrService, private stripePlansService: StripePlansService) { }

    ngOnInit(): void {
        this.tutorsService.getMy()
            .subscribe(successOne => { 
                this.currentStripePlanId = successOne.stripePlanId;
                this.stripeCountryId = successOne.stripeCountryID;
                this.tutor = successOne;
                this.setUpPaymentForm();
                this.loadPaymentMethod();
                this.loadSubscription(); 
                
                this.stripePlansService.getSubscriptionPlan().subscribe(success => {
                    this.stripePlans = success;

                    if (success[0].stripePlanId == this.currentStripePlanId) {
                        this.selectedPlan(success[0].stripePlanId, success[0].subscription.subscriptionId);
                    }
                    if (success[2].stripePlanId == this.currentStripePlanId) {
                        this.selectedPlan(success[2].stripePlanId, success[2].subscription.subscriptionId);
                    }
                    if (success[3].stripePlanId == this.currentStripePlanId) {
                        this.selectedPlan(success[3].stripePlanId, success[3].subscription.subscriptionId);
                    }


                }, error => {
                });

            }, error => {
            }); 

    };

    loadSubscription(): void {
        this.tutorsService.getSubscriptionByTutor(this.tutor.tutorId)
            .subscribe(success => {
                this.subscription = success;
            }, error => {
            });
    };

    loadPaymentMethod(): void {
        this.tutorsService.getDefaultPaymentMethodByTutor(this.tutor.tutorId)
            .subscribe(success => {
                this.paymentCard = success;
            }, error => {
            });
    };

    setUpPaymentForm(): void {
        this.stripeCountrysService.get()
            .subscribe(countrySuccess => {
                debugger;
                this.stripeCountrys = countrySuccess;
                this.paymentFormSubmitted = false;
                this.paymentForm = this.fb.group({
                    tutorId: [this.tutor.tutorId],
                    stripePlanId: [this.tutor.stripePlanId, [Validators.required]],
                    stripeCountryId: [this.stripeCountryId, [Validators.required]],
                    cardName: ['', [Validators.required, Validators.maxLength(250)]],
                    addressLine1: ['', [Validators.required, Validators.maxLength(250)]],
                    paymentMethodId: [''],
                    intentId: [''],
                    stripeSubscriptionId: [''],
                    intentClientSecret: [''],
                    stripeCustomerId: [''],
                    requiresAction: [false],
                    promoCode: [null, [Validators.maxLength(250)]],

                    dbsCheckData:[null],
                    newStripePlanId: [null],
                    newSubscriptionId: [null],
                });
                this.setupCardField();
            }, error => {
            });
    };

    submitPaymentForm() {
        debugger;
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {

            //this.toGetStatusOfSubscription(this.ProfileApprovalCheckNoFee, this.DBSApprovalCheckNoFee);

            //if (this.updateSubscriptionStatus == 'Not Set') {
            //    this.toGetStatusOfSubscription(this.ProfileApprovalCheckStarter, this.DBSApprovalCheckStarter);
            //}
            //if (this.updateSubscriptionStatus == 'Not Set') {
            //    this.toGetStatusOfSubscription(this.ProfileApprovalCheckPro, this.DBSApprovalCheckPro);
            //}

            //this.toGetStatusOfSelectedSubscription(this.ProfileApprovalSelectedPlan, this.DBSApprovalSelectedPlan);

            $('.loading').show();
            this.createPaymentCard();
        }
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
        }, 1000);
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
            this.handleStripeError(result.error);
            $('.loading').hide();
        } else {
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };

    confirmSubscriptionSend(): void {
        $('.loading').show();
        this.tutorsService.updatePayment(this.paymentForm.getRawValue())
            .subscribe(success => {
                this.handleServerResponse(success);
                this.buttonText = 'Update Changes';
                $('.loading').hide();
            }, err => {
                    this.handleStripeError(err.error);
                    this.buttonText = 'Update Changes';
                $('.loading').hide();
            });
    };

    handleServerResponse(fetchResult): void {
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(response => {
                this.cardActionResponse(response);
            });
        } else {

            //if (this.updateSubscriptionStatus == 'Off' && this.updateSubscriptionSelectedStatus == 'On') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 0; //we set directly 0 for both columns
            //}

            //if (this.updateSubscriptionStatus == 'On' && this.updateSubscriptionSelectedStatus == 'Off') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 99; //we need to check tutor record pending or rejected then only we need to update 99 , need to check both seprately
            //}

            //if (this.updateSubscriptionStatus == 'On' && this.updateSubscriptionSelectedStatus == 'On') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 100; //no need to do anything
            //}

            //if (this.updateSubscriptionStatus == 'Off' && this.updateSubscriptionSelectedStatus == 'Off') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 100; //no need to do anything
            //}
             
            //this.mySubscriptionUpdateObj = {
            //    'dbsProfileApproval': this.currentStatusForTuorDbsApprovalAndProfileApproval,
            //    'tutorId': this.tutor.tutorId,
            //    'subscriptionId': this.selectedSubscriptionId,
            //}

            this.mySubscriptionUpdateObj = {
                'stripePlanId': this.selectedStripePlanId,
                'subscriptionId': this.selectedSubscriptionId,
            }

            //if (this.subscriptionSelected) {
            //    this.tutorsService.updateTutorSubscription(this.mySubscriptionUpdateObj) //insert/update tutor subscription
            //        .subscribe(res => {
            //            this.toastrService.success('Success');
            //        }, error => {
            //        });
            //} else {
                this.toastrService.success('Success');
            //}
            this.ngOnInit();
        }
    };

    cardActionResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error);
        } else {
            this.confirmSubscriptionSend();
        }
    };

    handleStripeError(error: string): void {
        this.showStripeError = true;
        this.stripeError = error;
        this.setupCardField();
    };

    //selected plan for subscription by tutor
    selectedPlan(stripePlanID, subscriptionId) {
        debugger;
        if (this.stripePlans[3].stripePlanId == this.currentStripePlanId) {
            this.buttonText = 'Downgrade Subscription';
        }
        if (this.stripePlans[2].stripePlanId == this.currentStripePlanId) {
            if (this.stripePlans[0].stripePlanId == stripePlanID) {
                this.buttonText = 'Downgrade Subscription';
            }
            if (this.stripePlans[3].stripePlanId == stripePlanID) {
                this.buttonText = 'Upgrade Subscription';
            }
        }
        if (this.stripePlans[0].stripePlanId == this.currentStripePlanId) {
            this.buttonText = 'Upgrade Subscription';
        }


        this.paymentForm.controls.newStripePlanId.setValue(stripePlanID);
        this.paymentForm.controls.newSubscriptionId.setValue(subscriptionId);
        if (this.currentStripePlanId.toLocaleUpperCase() === '35612992-A2CB-45AE-A9E9-433F928DB119') {
            this.getDbsCheckDialog();
            
        } else {
            var $container = $("html,body");
            var $scrollTo = $('.Form_Block-Controls');
            $container.animate({ scrollTop: $scrollTo.offset().top + 1000, scrollLeft: 0 }, 300); 
        }

        
    }

    //get popup to select dbs check 
    getDbsCheckDialog() { 
        const dialogRef = this.dialog.open(DbsCheckDialog, {}); 
        dialogRef.afterClosed().subscribe((data: any) => {
            this.paymentForm.controls.dbsCheckData.setValue(data);
            debugger;
        });
    }



}
