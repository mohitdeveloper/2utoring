import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { RegistrationStep, EnumOption, StripeCountry, StripePlan, GuidOption, SearchOption, Company, Subscription } from '../../../models';
import { EnumsService, StripeService, StripeCountrysService, StripePlansService, TutorQualificationsService, TutorCertificatesService, TutorSubjectsService, SubjectsService, SubjectCategoriesService, StudyLevelsService } from '../../../services';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { ServiceHelper } from '../../../helpers/service.helper';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as $ from 'jquery';
import { CompanyService } from '../../../services/company.service';
import { CompanyRegistrationStep } from '../../../models/enums/company-registration-step.enum';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TeamMeetData } from '../../../models/team-meet-data';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { CropperComponent } from 'angular-cropperjs';
declare var jQuery: any;
// declare var Stripe: Function;
declare var Stripe: any;
declare var title: any;
declare var stripePlanId: any;


@Component({
    selector: 'app-company-register',
    templateUrl: './company-register.component.html',
    styleUrls: ['./company-register.component.scss']
})
export class CompanyRegisterComponent implements OnInit {

    serviceHelper: ServiceHelper = new ServiceHelper();

    company: Company;
    ownerEntityType: string = 'Company';
    stripePlanId: string = stripePlanId; // '81070046-8dc3-4ca9-3129-08d7e6c57421';
    companyId: string = undefined;
    companyFirstName: string = '';
    companyInitialRegistrationStep: number = 1; // Not 0
    isRegistrationDone: boolean = false;
    companyStoreProfileImageDownload: string = '';
    step = CompanyRegistrationStep.BasicInfo;
    router: any;
    get CompanyRegistrationStep() { return CompanyRegistrationStep; }
    stripe: any = Stripe(environment.stripeKey);
    userTitles: EnumOption[] = [];
    stripeCountrys: StripeCountry[] = [];
    countries: any[] = [{ countryId: "United Kingdom", name: "United Kingdom" }];
    meetData: TeamMeetData[] = [];
    stripePlan: StripePlan; // Stripe plan and associated subscription 

    companyBasicInfoForm: FormGroup;
    CompanyBasicInfoFormSubmitted: boolean = false;
    get basicInfoFormCompanyControls() { return this.companyBasicInfoForm.controls };

    paymentForm: FormGroup;
    paymentFormSubmitted: boolean = false;
    get paymentFormControls() { return this.paymentForm.controls };
    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;
    coupon: any = null;
    promoCodeChecked: boolean = false;
    promoCodeInvalid: boolean = false;
    validatedPromoCode: string = null;

    isCollapsed: boolean = false;

    // dbsCheckForm: FormGroup;
    // dbsCheckFormSubmitted: boolean = false;
    // get dbsCheckFormControls() { return this.dbsCheckForm.controls };

    profileFormSubStep: number = 1;
    profileOneForm: FormGroup;
    profileOneFormSubmitted: boolean = false;
    get profileOneFormControls() { return this.profileOneForm.controls };
    profileTwoForm: FormGroup;
    profileTwoFormSubmitted: boolean = false;
    get profileTwoFormControls() { return this.profileTwoForm.controls };
    profileThreeForm: FormGroup;
    profileThreeFormSubmitted: boolean = false;
    get profileThreeFormControls() { return this.profileThreeForm.controls };

    // TODO Profile upload and (descoped) Member Image upload 
    public profileThreeUploader: FileUploader = new FileUploader({ url: this.serviceHelper.baseApi + '/api/company/profileUpload', method: 'POST' });
    public profileThreeDropZoneOver: boolean = false;
    profileThreeUploaderShow: boolean = true;
    profileThreeUploaderPreviewUrl: SafeUrl;
    url: any;
    meetLogo: any;
    screenSize: number;
    scrHeight: any;
    scrWidth: any;

    public uploader: FileUploader = new FileUploader({ url: '', method: 'POST' });
    public dropZoneOver: boolean = false;
    uploaderShow: boolean = true;
    isProfileEdited: boolean = false;
    colSize: number = 9;
    isGoBack = false;

    croppedProfileImage: Blob;
    profileThreeCroppedImage: any = '';

    @ViewChild('angularCropper') public angularCropper: CropperComponent;
    config = {
        aspectRatio: 16 / 16,
        dragMode: 'move',
        background: true,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
        viewMode: 1,
        checkImageOrigin: true,
        cropmove: this.cropMoved.bind(this),
        ready: this.cropMoved.bind(this),
        checkCrossOrigin: true
    };
    constructor(private dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, private companyService: CompanyService, private enumsService: EnumsService, private stripeService: StripeService, private stripeCountrysService: StripeCountrysService, private stripePlansService: StripePlansService, private tutorQualificationsService: TutorQualificationsService, private tutorCertificatesService: TutorCertificatesService, private tutorSubjectsService: TutorSubjectsService, private subjectsService: SubjectsService, private subjectCategoriesService: SubjectCategoriesService, private studyLevelsService: StudyLevelsService, private sanitizer: DomSanitizer) { }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
    }
    ngOnInit() {
        this.getScreenSize();
        if (window.location.pathname == '/company/profile/edit') {
            this.isProfileEdited = true;
            this.colSize = 12;
            this.step = 6;
            this.isGoBack = true;
        } else {
            this.colSize = 9;
        }
        //get meet team data
        this.getMyTeamData();
        this.getStripePlanDetails(this.stripePlanId);

        this.companyBasicInfoForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(250)]],
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.maxLength(20)]],
            telephoneNumber: ['', [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [''],
            mobileNumber: ['', [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            companyName: ['', [Validators.required, Validators.maxLength(60)]],
            companyRegistrationNumber: [''],
            addressLine1: ['', [Validators.required]],
            addressLine2: ['', [Validators.required]],
            country: ['', [Validators.required]],
            companyPostcode: ['', [Validators.required]],
            companyTelephoneNumber: ['', [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            companyEmail: [''],
            companyMobileNumber: ['', [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            termsAndConditionsAccepted: [false, [Validators.required]],
            marketingAccepted: [false, []],
            whoWeAre: [''],
            whatWeDo: [''],
            whyWeDoIt: [''],
            whyChooseUs: [''],
            platformUse: ['']
        });

        //payment page
        this.paymentForm = this.fb.group({
            stripePlanId: ['', [Validators.required]],
            stripeCountryId: ['', [Validators.required]],
            cardName: ['', [Validators.required, Validators.maxLength(250)]],
            addressLine1: ['', [Validators.required, Validators.maxLength(250)]],
            postCode: ['', [Validators.required, Validators.maxLength(250)]],
            promoCode: ['', [Validators.required]],
            paymentMethodId: [''],
            intentId: [''],
            stripeSubscriptionId: [''],
            intentClientSecret: [''],
            stripeCustomerId: [''],
            requiresAction: [false]
        });

        //meet the team page
        this.profileTwoForm = this.fb.group({
            teamName: ['', [Validators.required]],
            teamRole: ['', [Validators.required]],
            teamDescription: ['', [Validators.required, Validators.maxLength(500)]],
        });

        //profile three form
        //this.profileThreeForm = this.fb.group({
        //    whoWeAre: [''],
        //    whatWeDo: [''],
        //    whyWeDoIt: [''],
        //    whyChooseUs: ['']

        //});

        // To test diff views - uncomment and see ui at /company/register/process/81070046-8dc3-4ca9-3129-08d7e6c57421
        //this.companyInitialRegistrationStep = 1; // enum CompanyRegistrationStep.Profile (6) 
        //this.step = 1;
        this.companyService.getBasicInfo()
            .subscribe(success => {
                if (success != null) {
                    debugger;
                    this.companyId = success.companyId;
                    this.companyFirstName = success.firstName;
                    this.companyInitialRegistrationStep = success.initialRegistrationStep;
                    this.isRegistrationDone = success.initialRegistrationComplete;
                    if (success.initialRegistrationStep > 0 && !this.isProfileEdited) {
                        this.navigate(success.initialRegistrationStep);
                    } else {
                        this.navigate(this.step);
                    }
                } else {
                    this.navigate(this.step);
                }
            }, error => {
                console.log(error);
                if (typeof error['Errors'] != "undefined") {
                    console.log(error['Errors']);
                }
            });
    };


    getStripePlanDetails(stripePlanId: string): void {
        this.stripePlansService.getById(stripePlanId)
            .subscribe(success => {
                $('.loading').hide();
                this.stripePlan = success;
            }, error => {
            });
    }

    navigate(step: CompanyRegistrationStep) {
        debugger;
        $('.loading').show();
        this.step = step;
        
        this.companyService.updateInitialRegisterStep(this.step)
            .subscribe(success => {
                if (success != null) {
                    this.companyInitialRegistrationStep = success.initialRegistrationStep;
                }
            }, error => {
            });

        if (this.step == CompanyRegistrationStep.BasicInfo) {

            this.enumsService.get('UserTitle')
                .subscribe(success => {
                    this.userTitles = success;
                }, error => {
                });

            this.companyService.getBasicInfo()
                .subscribe(success => {
                    this.CompanyBasicInfoFormSubmitted = false;
                    this.companyBasicInfoForm = this.fb.group({
                        title: [success.title, [Validators.required, Validators.maxLength(250)]],
                        firstName: [success.firstName, [Validators.required, Validators.maxLength(20)]],
                        lastName: [success.lastName, [Validators.required, Validators.maxLength(20)]],
                        telephoneNumber: [success.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        email: [{ value: success.email, disabled: true }],
                        mobileNumber: [success.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        companyName: [success.companyName, [Validators.required, Validators.maxLength(60)]],
                        companyRegistrationNumber: [success.companyRegistrationNumber],
                        //companyAddress: [success.companyAddress, [Validators.required]],
                        addressLine1: [success.addressLine1, [Validators.required]],
                        addressLine2: [success.addressLine2, [Validators.required]],
                        country: [success.country, [Validators.required]],
                        companyPostcode: [success.companyPostcode, [Validators.required]],
                        companyTelephoneNumber: [success.companyTelephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        companyEmail: [success.companyEmail],
                        companyMobileNumber: [success.companyMobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        termsAndConditionsAccepted: [Boolean(success.termsAndConditionsAccepted), [Validators.required]],
                        marketingAccepted: [success.marketingAccepted, []],
                        whoWeAre: [success.whoWeAre],
                        whatWeDo: [success.whatWeDo],
                        whyWeDoIt: [success.whyWeDoIt],
                        platformUse: ['1'],

                    });
                    $('.loading').hide();
                }, error => {
                    console.log('Get basic info failed.. in error case');
                });
            this.moveToStep();
        } else if (this.step == CompanyRegistrationStep.Payment) {
            this.companyService.getBasicInfo()
                .subscribe(success => {
                    if (success != null && success.paymentStatus == 'Paid') {
                        this.navigate(CompanyRegistrationStep.PaymentApproved);
                    } else {
                        this.stripeCountrysService.get()
                            .subscribe(success => {
                                this.stripeCountrys = success;
                                this.paymentFormSubmitted = false;
                                this.paymentForm = this.fb.group({
                                    stripePlanId: [this.stripePlanId, [Validators.required]],
                                    stripeCountryId: [this.stripeCountrys[0].stripeCountryId, [Validators.required]],
                                    cardName: ['', [Validators.required, Validators.maxLength(250)]],
                                    addressLine1: ['', [Validators.required, Validators.maxLength(250)]],
                                    promoCode: [null, [Validators.maxLength(250)]],
                                    postCode: ['', [Validators.required, Validators.maxLength(250)]],
                                    paymentMethodId: [''],
                                    intentId: [''],
                                    stripeSubscriptionId: [''],
                                    intentClientSecret: [''],
                                    stripeCustomerId: [''],
                                    requiresAction: [false],
                                });
                            }, error => {
                            });
                        if (this.stripePlan == null) {
                            this.getStripePlanDetails(this.stripePlanId);
                        }
                        this.setupCardField();
                        $('.loading').hide();
                    }
                }, error => {
                });
            this.moveToStep();
        } else if (this.step == CompanyRegistrationStep.PaymentApproved) {
            this.companyService.getBasicInfo()
                .subscribe(success => {
                    //debugger;
                    if (success != null) {
                        this.companyId = success.companyId;
                        this.companyFirstName = success.firstName;
                        $('.loading').hide();
                    }
                }, error => {
                });
            this.moveToStep();
        } else if (this.step == CompanyRegistrationStep.Profile) {
            this.companyService.getMy()
                .subscribe(success => {
                    //debugger;
                    this.companyStoreProfileImageDownload = success.storeProfileImageDownload;
                    this.profileOneFormSubmitted = false;
                    this.profileOneForm = this.fb.group({
                        companyId: [success.companyId],
                        companyName: [success.companyName],
                        companyDescription: [success.companyDescription, [Validators.required, Validators.maxLength(1999)]],
                        whoWeAre: [success.whoWeAre, [Validators.maxLength(1999)]],
                        whatWeDo: [success.whatWeDo, [Validators.maxLength(1999)]],
                        whyWeDoIt: [success.whyWeDoIt, [Validators.maxLength(1999)]],
                        whyChooseUs: [success.whyChooseUs, [Validators.maxLength(1999)]],
                        platformUse: ['1']
                    });

                    this.profileTwoFormSubmitted = false;
                    this.profileTwoForm = this.fb.group({
                        teamName: ['', [Validators.required]],
                        teamRole: ['', [Validators.required]],
                        teamDescription: ['', [Validators.required, Validators.maxLength(1999)]],
                    });
                    

                    //profile three form
                    //this.profileThreeFormSubmitted = false;
                    //this.profileThreeForm = this.fb.group({
                    //    whoWeAre: [success.whoWeAre],
                    //    whatWeDo: [success.whatWeDo],
                    //    whyWeDoIt: [success.whyWeDoIt],
                    //    whyChooseUs: [success.whyChooseUs]
                    //});
                    $('.loading').hide();
                }, error => {
                });
            if (!this.profileOneFormSubmitted) {
                this.moveToStep(); 
            }
            else {
                this.moveToStep('addTeamMembers'); 
            }
        } else if (this.step == CompanyRegistrationStep.Price) {
            this.moveToStep();
       
        } else if (this.step == CompanyRegistrationStep.Finish) {
            $('.loading').hide();
        }
    }

    submitCompanyBasicInfoForm() {
        debugger;
        this.CompanyBasicInfoFormSubmitted = true;
        if (this.companyBasicInfoForm.valid) {
            $('.loading').show();
            var companyRegisterBasicInfo = { ...this.companyBasicInfoForm.getRawValue() };
            companyRegisterBasicInfo.stripePlanId = this.stripePlanId;
            this.companyService.saveCompanyBasicInfo(companyRegisterBasicInfo)
                .subscribe(success => {
                    this.toastr.success('Company details saved sucessfully!');
                    this.navigate(CompanyRegistrationStep.Payment);
                }, error => {
                    $('.loading').hide();
                    this.toastr.error('Something went wrong');
                });
        }
    };

    submitPaymentForm() {
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
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
        }, 3000);
    };

    checkPromoCode(): void {
        $('.loading').show();
        this.stripeService.validatePromoCode(this.paymentForm.controls.promoCode.value)
            .subscribe(success => {
                $('.loading').hide();
                this.promoCodeChecked = true;
                if (success != null) {
                    this.coupon = success;
                    this.promoCodeInvalid = false;
                    this.validatedPromoCode = this.paymentForm.controls.promoCode.value;
                }
                else {
                    this.coupon = null;
                    this.promoCodeInvalid = true;
                    this.validatedPromoCode = null;
                }
            }, err => {
                $('.loading').hide();
                this.coupon = null;
                this.promoCodeChecked = true;
                this.promoCodeInvalid = true;
                this.validatedPromoCode = null;
            });
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
            console.log("createPaymentCard billing_details:", response);
            this.paymentCardResponse(response);
        });
    };

    paymentCardResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        } else {
            this.step = CompanyRegistrationStep.PaymentProcessing;
            $('.loading').hide();
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };

    confirmSubscriptionSend(): void {
        $('.loading').show();
        this.companyService.savePayment(this.paymentForm.getRawValue())
            .subscribe(success => {
                this.handleServerResponse(success);
                $('.loading').hide();
            }, err => {
                this.handleStripeError(err.error);
                $('.loading').hide();
            });
    };

    handleServerResponse(fetchResult): void {
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(response => {
                this.step = CompanyRegistrationStep.PaymentFailed;
                this.cardActionResponse(response);
            });
        } else {
            this.step = CompanyRegistrationStep.PaymentApproved;
            this.navigate(this.step);
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
        this.step = CompanyRegistrationStep.Payment;
        this.setupCardField();
    };

    // Description and (todo) Profile Image upload
    submitProfileOneForm() {
        debugger;
        this.profileOneFormSubmitted = true;
        if (this.profileOneForm.valid) {
            $('.loading').show();
            //debugger; 
            this.companyService.saveProfileOne(this.profileOneForm.getRawValue())
                .subscribe(success => {
                    this.toastr.success('Details saved!');
                    $('#addTeamMembers').css('display', 'block');
                    // this.profileFormSubStep = 2;
                    //this.navigate(CompanyRegistrationStep.Price);
                    $('.loading').hide();
                    if (this.profileThreeUploader.queue.length > 0) {
                        this.uploadCompanyProfileImage();
                    }
                }, error => {
                });
        }
    };

    uploadCompanyProfileImage() {
        if (this.profileThreeUploader.queue.length > 0) {
            $('.loading').show();
            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;
            this.profileThreeUploader.onErrorItem = () => {
                $('.loading').hide();
                this.toastr.error('We were unable to upload your logo');
            }
            this.profileThreeUploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.profileThreeUploader.clearQueue();
                    this.profileThreeUploaderShow = true;
                    this.toastr.success('Logo uploaded successfully!!');
                    this.navigate(CompanyRegistrationStep.Profile);
                } else {
                    $('.loading').hide();
                    this.toastr.error('We were unable to upload your logo');
                }
            }
        } else if (this.companyStoreProfileImageDownload != null && this.companyStoreProfileImageDownload.length > 0) {
            this.toastr.error('Logo uploaded successfully!!');
            // As this is only Add button click, we dont navigate anywhere.
        }
        else {
            this.toastr.error('Please upload a logo to continue');
        }
    }

    // Add company members form
    submitProfileTwoForm() {
        this.profileTwoFormSubmitted = true;
        if (this.profileTwoForm.valid) {
            $('.loading').show();
            this.companyService.addCompanyMember(this.profileTwoForm.getRawValue())
                .subscribe(success => {
                    this.getMyTeamData();
                    // this.profileFormSubStep = 3;
                    this.profileTwoForm.reset();
                    this.toastr.success('Member added!');
                    $('.loading').hide();
                    this.profileTwoFormSubmitted = false;
                }, error => {
                });
        }
    };

    public fileOverProfileThreeUploader(e: any): void {
        this.profileThreeDropZoneOver = e;
    }

    public profileThreeUploaderFileDropped(e: any): void {
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/

        let index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
        //var reader = new FileReader();
        //if (e.target) {
        //    reader.readAsDataURL(e.target.files[0]);
        //    reader.onload = (event) => {
        //        this.profileThreeUploaderPreviewUrl = event.target.result;
        //    }
        //}
    }

    //submitProfileThreeForm() {
    //    this.profileThreeFormSubmitted = true;
    //    $('.loading').show();
    //    var profileThreeData = this.profileThreeForm.getRawValue();
    //    var profileOneData = this.profileOneForm.getRawValue();
    //    profileThreeData.companyDescription = profileOneData.companyDescription;
    //    profileThreeData.companyId = this.companyId;
    //    this.companyService.saveProfileThree(profileThreeData)
    //        .subscribe(success => {
    //            $('.loading').hide();
    //            this.toastr.success('Saved successfully!');
    //            if (this.isProfileEdited) {
    //                window.location.href = '/admin'; 
    //                return;
    //            }
    //            this.navigate(CompanyRegistrationStep.Finish);
    //        }, error => {
    //            this.toastr.error('Something went wrong!');
    //        });

    //};

    // Descoped for now.
    public teamFileDropped(event: any): void {
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            //to show preview
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.meetLogo = event.target.result;
            }
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.companyService.getBasicInfo()
                        .subscribe(success => {
                            this.company = success;
                            $('.loading').hide();
                        }, error => {
                        });
                } else {
                    $('.loading').hide();
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.toastr.error('We were unable to upload your logo');
                }
            }
        }
    }

    //get my team data
    getMyTeamData() {
        this.companyService.getTeamData()
            .subscribe(success => {
                if (success != null) {
                    console.log("Got Team data:", success);
                    this.meetData = success;
                }
            }, error => {
                // debugger;
            });
    }

    getSubscriptionName(): string {
        if (this.stripePlan && this.stripePlan.subscription && this.stripePlan.subscription.subscriptionName)
            //return this.stripePlan.subscription.subscriptionName;
            return this.stripePlan.subscription.description;
        else return "";
    }

    getSubscriptionPrice(): number {
        if (this.stripePlan.subscription.subscriptionPrice)
            //return this.stripePlan.subscription.subscriptionName;
            return this.stripePlan.subscription.subscriptionPrice;
    }

    //delete team data
    openDialog(mbrId, index) {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                //debugger;
                //this.meetData.splice(index, 1);
                // delete query will gone here
                this.companyService.deleteCompanyMember(mbrId)
                    .subscribe(success => {
                        this.meetData.splice(index, 1); // Splice after delete is success
                        this.toastr.success('Member removed!');
                        //console.log(success);
                    }, error => {
                    });
            }
        });
    }

    cropMoved(data) {
        //debugger;
        let canvas = this.angularCropper.cropper.getCroppedCanvas({
            width: 170,
            height: 170,
        });
        this.profileThreeCroppedImage = canvas.toDataURL();
        canvas.toBlob((blob: any) => {
            debugger;
            blob['name'] = 'myfilename.png';
            /*if (this.profileThreeUploader.queue.length > 1) {
                this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
            }*/
            // this.croppedProfileImage = blob;
            this.profileThreeUploader.clearQueue();
            this.profileThreeUploader.addToQueue([blob]);
        })

        $('.cropper img').show();
    }

    moveToStep(dvId = 'dvInfo') {

        let innerHeight = window.innerHeight;
        let innerWidth = window.innerWidth;

        if (innerWidth <= 967) {
            //console.log("Height:" + innerHeight + " " + "Width:" + innerWidth);
            setTimeout(function () {
                var $container = $("html,body");
                var $scrollTo = $('#' + dvId);
                $container.animate({ scrollTop: $scrollTo.offset().top, scrollLeft: 0 }, 1000);
            }, 500);

        }
    }
}
