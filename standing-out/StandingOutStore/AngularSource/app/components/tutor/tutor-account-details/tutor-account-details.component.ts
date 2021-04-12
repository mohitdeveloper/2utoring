import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TutorsService, EnumsService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { EnumOption } from '../../../models';

@Component({
    selector: 'app-tutor-account-details',
    templateUrl: './tutor-account-details.component.html',
    styleUrls: ['./tutor-account-details.component.css']
})
export class TutorAccountDetailsComponent implements OnInit {

    userTitles: EnumOption[] = [];
    basicInfoForm: FormGroup;
    bankDetailsForm: FormGroup; // Only applies for CompanyTutor
    bankDetailsApplicable: boolean = false;
    isCompanyTutor: boolean = false;
    basicInfoFormSubmitted: boolean = false;
    bankDetailsFormSubmitted: boolean = false;
    get basicInfoFormControls() { return this.basicInfoForm.controls };
    get bankDetailsFormControls() { return this.bankDetailsForm.controls };

    constructor(private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private enumsService: EnumsService) { }

    ngOnInit(): void {
        this.enumsService.get('UserTitle')
            .subscribe(success => {
                this.userTitles = success;
            }, error => {
            });
        this.resetForm();
    }

    resetForm(): void {
        $('.loading').show();
        this.tutorsService.getBasicInfo()
            .subscribe(success => {
                console.log("CurrentCompany:", success.currentCompany);
                this.isCompanyTutor = (success.currentCompany != null);
                this.bankDetailsApplicable = this.isCompanyTutor;
                if (this.isCompanyTutor) this.setupBankDetailsPage(); // Setup bank Details Form if applicable

                this.basicInfoFormSubmitted = false;
                this.basicInfoForm = this.fb.group({
                    userId: [success.userId],
                    title: [success.title, [Validators.required, Validators.maxLength(250)]],
                    firstName: [success.firstName, [Validators.required, Validators.maxLength(20)]],
                    lastName: [success.lastName, [Validators.required, Validators.maxLength(20)]],
                    telephoneNumber: [success.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    email: [{ value: success.email, disabled: true }],
                    dateOfBirthDay: [success.dateOfBirthDay, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
                    dateOfBirthMonth: [success.dateOfBirthMonth, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
                    dateOfBirthYear: [success.dateOfBirthYear, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4)]],
                    mobileNumber: [success.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    //termsAndConditionsAccepted: [success.termsAndConditionsAccepted, [Validators.required]],
                    marketingAccepted: [success.marketingAccepted, []],
                });
                $('.loading').hide();
            }, error => {
            });
    };

    setupBankDetailsPage() {
        this.tutorsService.getMy()
            .subscribe(success => {
                console.log("Got bank details:", success);
                this.bankDetailsFormSubmitted = false;
                this.bankDetailsForm = this.fb.group({
                    bankAccountNumber: [success.bankAccountNumber, [Validators.required, Validators.maxLength(20)]],
                    bankSortCode: [success.bankSortCode, [Validators.required, Validators.maxLength(10)]],
                    addressLine1: [success.addressLine1, [Validators.required, Validators.maxLength(250)]],
                    postCode: [success.postCode, [Validators.required, Validators.maxLength(10)]],
                });
            }, error => { });
    }

    checkDateValid(): boolean {
        // Basic validation checks
        if (this.basicInfoForm.controls.dateOfBirthYear.errors || this.basicInfoForm.controls.dateOfBirthMonth.errors || this.basicInfoForm.controls.dateOfBirthDay.errors) {
            return false;
        }

        let dateString = this.getDateString();
        let date = Date.parse(dateString);
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

    dateOfBirthInvalid(): boolean {
        if (this.checkDateValid()) {
            let dateOfBirth: Date = new Date(Date.parse(this.getDateString()));
            let dateToMatch: Date = (new Date());
            dateToMatch = new Date(dateToMatch.getFullYear() - 13, dateToMatch.getMonth(), dateToMatch.getDay());
            if (dateOfBirth > dateToMatch) {
                return true;
            }
        }
        return false;
    };

    getDateString(): string {
        return this.basicInfoForm.controls.dateOfBirthYear.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthMonth.value + '-' +
            (this.basicInfoForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.basicInfoForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };

    submitBasicInfoForm() {
        this.basicInfoFormSubmitted = true;
        if (this.basicInfoForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            $('.loading').show();
            this.tutorsService.saveBasicInfo({ ...this.basicInfoForm.getRawValue(), dateOfBirth: new Date(Date.parse(this.getDateString())) })
                .subscribe(success => {
                    this.toastr.success('Your account info has been updated');
                    //this.resetForm();
                }, error => {
                    $('.loading').hide();
                    if (error.code == 400) {
                        this.toastr.error('Please enter a valid date of birth');
                    } else {
                        this.toastr.error('We were unable to update your account info');
                    }
                }, () => {
                    this.submitBankDetailsForm();
                    this.resetForm();
                });
        }
    };

    submitBankDetailsForm() {
        if (this.bankDetailsApplicable) {
            if (this.bankDetailsForm.touched == false) return;

            var bankDetailsFormData = this.bankDetailsForm.getRawValue();
            console.log("Saving bank details:", bankDetailsFormData);
            this.bankDetailsFormSubmitted = true;
            if (this.bankDetailsForm.valid) {
                this.tutorsService.saveBankDetail(bankDetailsFormData)
                    .subscribe(success => {
                        this.toastr.success('Your bank info has been updated');
                    }, err => { }, () => {
                        $('.loading').hide();
                    });
            }
        }
    };
}
