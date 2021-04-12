import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { StripeService, UsersService } from '../../../services';
import { StripeBankAccount } from '../../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare let title: string;
declare let stripeConnectAccountId: string;
declare let stripeConnectBankAccountId: string;
declare let error: boolean;
declare let success: boolean;
declare let stKey: string;
declare let tutorId: string;
declare let companyId:string;


@Component({
    selector: 'app-settings-payout',
    templateUrl: './settings-payout.component.html'
})

export class SettingsPayoutComponent implements OnInit {
    constructor(private toastr: ToastrService, private stripeService: StripeService, private formBuilder: FormBuilder, private usersService: UsersService) { }
    alertMessage: any = null;
    userId: string;
    title: string = title;
    stripeConnectAccountId: string = stripeConnectAccountId;
    stripeConnectBankAccountId: string = stripeConnectBankAccountId;
    stKey: string = stKey;
    tutorId: string = tutorId;
    companyId: string = companyId;
    error: boolean = error;
    success: Boolean = success; //needs to be nullable 
    stripeBankAccounts: StripeBankAccount[] = [];
    showReloadList: boolean = false;
    companyLoginMode: boolean = false;
    userPayoutStatus: boolean = false;

    toLoad: number = this.stripeConnectAccountId !== undefined && this.stripeConnectAccountId != null && this.stripeConnectAccountId != '' && this.alertMessage?.idVerificationStatus == 'Approved' && (success == true || success === undefined) ? 1 : 0;
    loaded: number = 0;

    bankForm: FormGroup = this.formBuilder.group({});
    bankFormSubmitted: boolean = false;
    get bankFormControls() { return this.bankForm.controls; }

    incrementLoad(): void {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit() {
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

    getBankAccounts(): void {
        $('.loading').show();

        this.stripeService.getMyBankAccounts().subscribe(success => {
            this.stripeBankAccounts = success;
            this.setupForm();
            this.incrementLoad();
        }, err => {
            this.toastr.error("We were unable to load your bank accounts. Please try again.");
        })
    };

    payoutRedirect(): void {
        if (this.companyLoginMode) {
            window.location.href = '/admin/settings/payoutredirect';
        } else {
            window.location.href = '/tutor/settings/payoutredirect';
        }
    };

    setupForm(): void {
        this.bankForm = this.formBuilder.group({
            stripeConnectBankAccountId: [this.stripeConnectBankAccountId, [Validators.required]],
        });
    };

    save(): void {
        this.bankFormSubmitted = true;

        if (this.stripeBankAccounts.findIndex(o => o.id == this.bankForm.controls.stripeConnectBankAccountId.value) == -1) {
            stripeConnectBankAccountId = '';
            this.stripeConnectBankAccountId = '';
            this.bankForm.controls.stripeConnectBankAccountId.setValue('');
        }
        if (this.bankForm.valid) {
            $('.loading').show();

            this.stripeService.patchBankId(this.bankForm.controls.stripeConnectBankAccountId.value).subscribe(success => {
                this.toastr.success("Your account info has been updated");
                $('.loading').hide();
            }, err => {
                this.toastr.error("We were unable to update your account info");
            })
        }
    };

    manageAccount(): void {
        $('.loading').show();

        this.stripeService.getLoginLink().subscribe(success => {
            this.showReloadList = true;
            window.open(success);
            this.incrementLoad();
        }, err => {
            this.toastr.error("Sorry this service is currently unavailable");
        })
    }

    getUserPayoutResponse() {

        if (this.tutorId != null) {

            this.usersService.getPayoutResponseFromStripe(stripeConnectAccountId, stKey)
                .subscribe(success => {
                    this.userPayoutStatus = success.payouts_enabled;
                    if (this.userPayoutStatus) {
                        debugger;
                        var obj = {
                            tutorId: this.tutorId,
                            companyId: this.companyId,
                            status: this.userPayoutStatus
                        }
                        this.usersService.updateIdVerificationStautsForTutor(obj)
                            .subscribe(success => {}, error => {
                            });
                    }
                }, error => {
                });
        }

        if (this.companyId != null) {

            this.usersService.getPayoutResponseFromStripe(stripeConnectAccountId, stKey)
                .subscribe(success => {
                    this.userPayoutStatus = success.payouts_enabled;
                    if (this.userPayoutStatus) {
                        var obj = {
                            tutorId: this.tutorId,
                            companyId: this.companyId,
                            status: this.userPayoutStatus
                        }
                        this.usersService.updateIdVerificationStautsForCompany(obj)
                            .subscribe(success => {}, error => {
                            });
                    }
                }, error => {
                });
        }

    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }
}

