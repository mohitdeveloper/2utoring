import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Company } from '../../../models';
import { EnumsService } from '../../../services';
import { ServiceHelper } from '../../../helpers/service.helper';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { CompanyService } from '../../../services/company.service';

@Component({
    selector: 'app-company-account-details',
    templateUrl: './company-account-details.component.html',
    styleUrls: ['./company-account-details.component.css']
})
export class CompanyAccountDetailsComponent implements OnInit {

    serviceHelper: ServiceHelper = new ServiceHelper();

    company: Company;
    companyId: string = undefined;
    companyFirstName: string = '';

    companyBasicInfoForm: FormGroup;
    CompanyBasicInfoFormSubmitted: boolean = false;
    get basicInfoFormCompanyControls() { return this.companyBasicInfoForm.controls };

    constructor(private fb: FormBuilder, private toastr: ToastrService,
        private companyService: CompanyService,
        private enumsService: EnumsService) { }

    ngOnInit(): void {
        this.buildBasicInfoForm();

        this.getBasicInfo();
    }

    buildBasicInfoForm(): void {
        this.companyBasicInfoForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.maxLength(20)]],
            telephoneNumber: ['', [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [''],
            mobileNumber: ['', [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            companyName: ['', [Validators.required, Validators.maxLength(20)]],
            companyRegistrationNumber: ['', [Validators.maxLength(20)]],
            addressLine1: ['', [Validators.required]],
            addressLine2: ['', [Validators.required]],
            country: ['', [Validators.required]],
            companyPostcode: ['', [Validators.required]],
            companyTelephoneNumber: ['', [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            companyEmail: [''],
            companyMobileNumber: ['', [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            termsAndConditionsAccepted: [true],
            marketingAccepted: [false, []],
        });
    }

    getBasicInfo(): void {
        this.companyService.getBasicInfo()
            .subscribe(success => {
                this.CompanyBasicInfoFormSubmitted = false;
                this.companyBasicInfoForm = this.fb.group({
                    firstName: [success.firstName, [Validators.required, Validators.maxLength(20)]],
                    lastName: [success.lastName, [Validators.required, Validators.maxLength(20)]],
                    telephoneNumber: [success.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    email: [{ value: success.email, disabled: true }],
                    mobileNumber: [success.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    companyName: [success.companyName, [Validators.required, Validators.maxLength(20)]],
                    companyRegistrationNumber: [success.companyRegistrationNumber, [Validators.maxLength(20)]],
                    //companyAddress: [success.companyAddress, [Validators.required]],
                    addressLine1: [success.addressLine1, [Validators.required]],
                    addressLine2: [success.addressLine2, [Validators.required]],
                    country: [success.country, [Validators.required]],
                    companyPostcode: [success.companyPostcode, [Validators.required]],
                    companyTelephoneNumber: [success.companyTelephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    companyEmail: [success.companyEmail],
                    companyMobileNumber: [success.companyMobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                    termsAndConditionsAccepted: [true],
                    marketingAccepted: [success.marketingAccepted, []],
                });
            }, error => {
                console.log('Get basic info failed.. in error case');
            }, () => {
                $('.loading').hide();
            });
    }

    submitCompanyBasicInfoForm() {
        //debugger;
        this.CompanyBasicInfoFormSubmitted = true;
        if (this.companyBasicInfoForm.valid) {
            $('.loading').show();
            var companyRegisterBasicInfo = { ...this.companyBasicInfoForm.getRawValue() };
            //companyRegisterBasicInfo.stripePlanId = this.stripePlanId;
            this.companyService.saveCompanyBasicInfo(companyRegisterBasicInfo)
                .subscribe(success => {
                    this.toastr.success('Company details saved sucessfully!');
                    // TODO redirect to where?
                }, error => {
                    this.toastr.error('Something went wrong');
                }, () => {
                    $('.loading').hide();
                });
        }
    };

}
