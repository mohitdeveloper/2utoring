import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import {
    RegistrationStep, EnumOption, StripeCountry, StripePlan, TutorQualification, TutorCertificate, TutorSubject, GuidOption, SearchOption,
    Company, RegistrationJourneyType
} from '../../../models';
import {
    TutorsService, EnumsService, StripeService, StripeCountrysService, StripePlansService, TutorQualificationsService, TutorCertificatesService, TutorSubjectsService, SubjectsService, SubjectCategoriesService, StudyLevelsService,
    CompanyService
} from '../../../services';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { ServiceHelper } from '../../../helpers/service.helper';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as $ from "jquery";
import { CalenderComponent } from '../../calender/calender.component';
import { SubjectStudylevelCreateDialogComponent } from '../../subject-studylevel-setup/subject-studylevel-create-dialog/subject-studylevel-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TutorInfoDialogComponent } from '../../tutor/tutors-index/tutor-info-dialog.component';
//import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { CropperComponent } from 'angular-cropperjs';
declare var jQuery: any;

declare var Stripe: Function;
declare var title: any;
declare var stripePlanId: any;
declare var companyId: any;

//Same component used for:
//1. Tutor direct registration (with StripePlanId)
//2. Tutor register on Company Invite (with CompanyId)

@Component({
    selector: 'app-tutor-register',
    templateUrl: './tutor-register.component.html',
    styleUrls: ['./tutor-register.component.scss']
})
export class TutorRegisterComponent implements OnInit {

    serviceHelper: ServiceHelper = new ServiceHelper();
    @ViewChild('calendarRef') calendarRef: CalenderComponent;

    stripePlanId: string = stripePlanId || null;
    companyId: string = companyId || null;

    company: Company; // as per companyId param
    currentCompany: Company = new Company();
    stripeCountryId: string = '0: 87017cf8-e86a-4a98-191b-08d7e6c57416';
    tutorId: string = undefined;
    tutorFirstName: string = '';
    tutorInitialRegistrationStep: number = 0;
    isRegistrationDone: boolean = false;
    tutorStoreProfileImageDownload: string = '';

    isApproved: boolean;

    ownerEntityType: string = 'Tutor';

    step = RegistrationStep.BasicInfo;
    get registerStep() { return RegistrationStep; }

    journeyType = RegistrationJourneyType.TutorRegistration;

    get registrationJourneyType() { return RegistrationJourneyType; }

    stripe: any = Stripe(environment.stripeKey);
    userTitles: EnumOption[] = [];
    stripeCountrys: StripeCountry[] = [];
    stripePlan: StripePlan;

    basicInfoForm: FormGroup;
    basicInfoFormSubmitted: boolean = false;
    get basicInfoFormControls() { return this.basicInfoForm.controls };

    paymentForm: FormGroup;
    paymentFormSubmitted: boolean = false;
    get paymentFormControls() { return this.paymentForm.controls };

    bankDetailsForm: FormGroup;
    bankDetailsFormSubmitted: boolean = false;
    get bankDetailsFormControls() { return this.bankDetailsForm.controls };

    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;
    coupon: any = null;
    promoCodeChecked: boolean = false;
    promoCodeInvalid: boolean = false;
    validatedPromoCode: string = null;

    dbsCheckForm: FormGroup;
    dbsCheckFormSubmitted: boolean = false;
    get dbsCheckFormControls() { return this.dbsCheckForm.controls };

    profileFormSubStep: number = 1;
    profileOneForm: FormGroup;
    profileOneFormSubmitted: boolean = false;
    get profileOneFormControls() { return this.profileOneForm.controls };
    profileTwoForm: FormGroup;
    profileTwoFormSubmitted: boolean = false;
    get profileTwoFormControls() { return this.profileTwoForm.controls };
    public profileThreeUploader: FileUploader = new FileUploader({ url: this.serviceHelper.baseApi + '/api/tutors/profileUpload', method: 'POST' });
    public profileThreeDropZoneOver: boolean = false;
    profileThreeUploaderShow: boolean = true;
    profileThreeUploaderPreviewUrl: SafeUrl;

    qualificationFormSubStep: number = 1;
    qualificationForm: FormGroup;
    qualificationFormSubmitted: boolean = false;
    get qualificationFormControls() { return this.qualificationForm.controls };
    tutorQualifications: TutorQualification[] = [];
    public qualificationFormUploader: FileUploader = new FileUploader({ allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'], url: this.serviceHelper.baseApi + '/api/tutorCertificates/upload', method: 'POST' });
    public qualificationFormDropZoneOver: boolean = false;
    qualificationFormUploaderShow: boolean = true;
    tutorCertificates: TutorCertificate[] = [];
    registerdEvents: any;
    screenSize: number;
    scrHeight: any;
    scrWidth: any;

    subjectForm: FormGroup;
    subjectFormSubmitted: boolean = false;
    get subjectFormControls() { return this.subjectForm.controls };
    get tutorSubjectStudyLevelsFormArrayControls() { return this.subjectForm.get('tutorSubjectStudyLevels') as FormArray; }
    tutorSubjects: TutorSubject[] = [];
    subjects: SearchOption[] = [];
    subjectCategorys: SearchOption[] = [];
    journeyTypeForTutor: boolean = false;
    isFilterVisible: number;
    dbsCheckAllowedInSubscriptoin: boolean = true;
    stripeCountrys: StripeCountry[] = [];
    ProfileApprovalRequired: boolean;
    editSlot: boolean = true;

    skipType: boolean = false;

    supportedFileTypes: string[] = ['image/png', 'image/jpeg'];
    imageChangedEvent: any = '';
    profileThreeCroppedImage: any;
    croppedProfileImage: Blob;
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

    constructor(public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private enumsService: EnumsService, private stripeService: StripeService, private stripePlansService: StripePlansService, private tutorQualificationsService: TutorQualificationsService, private tutorCertificatesService: TutorCertificatesService, private tutorSubjectsService: TutorSubjectsService, private subjectsService: SubjectsService, private subjectCategoriesService: SubjectCategoriesService, private studyLevelsService: StudyLevelsService,
        private sanitizer: DomSanitizer , private companyService: CompanyService, private stripeCountrysService: StripeCountrysService) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.fc-today-button').addClass('col-12');
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        } else {
            $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }


        if (this.screenSize >= 1300) {
            $('.mfs').css('display', 'none');
            // $('.fc-today-button').addClass('col-12');
            $('#myOtherLessonView').css('display', 'block');
        } else {
            // $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
    }

    getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        //console.log(this.scrHeight, this.scrWidth);

        if (this.scrWidth <= 1025) {
            setTimeout(() => {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 1000)
        } else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }

        if (this.scrWidth >= 1350) {
            setTimeout(() => {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300)
        }

        if (this.scrWidth <= 768) {
            setTimeout(() => {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300)

        } else {
            setTimeout(() => {
                $('.fc-today-button').removeClass('col-12');
            }, 300)
        }

    }



    ngOnInit() {
        this.getScreenSize();
        //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
        //    this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
        //    this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
        //}, err => {
        //})

        this.stripeCountrysService.get()
            .subscribe(countrySuccess => {
                this.stripeCountrys = countrySuccess;
            });

        //this.getSubscription();
        if (this.journeyType == RegistrationJourneyType.TutorRegistration) {
            this.journeyTypeForTutor = true;

        }

        this.setupJourneyType();
        this.getStripePlanDetails(this.stripePlanId);
        this.getCompanyDetails(this.companyId);

        this.tutorsService.getMy()
            .subscribe(success => {

                if (success != null) {
                    this.tutorId = success.tutorId;
                    this.tutorFirstName = success.userFirstName;
                    this.tutorInitialRegistrationStep = success.initialRegistrationStep;
                    this.currentCompany = success.currentCompany;
                    this.preventJoiningAnotherCompany();
                    if (success.initialRegistrationStep > 0) {
                        this.navigate(success.initialRegistrationStep);
                    } else {
                        this.navigate(this.step);
                    }
                } else {
                    this.navigate(this.step);
                }
            }, error => {
            });
    }

    setupJourneyType() {

        if (this.stripePlanId != null && this.companyId == null) {
            this.journeyType = RegistrationJourneyType.TutorRegistration;
            this.isFilterVisible = 2;
        }
        else {
            this.journeyType = RegistrationJourneyType.TutorJoiningCompany;
            this.isFilterVisible = 3;
        }
    }

    getCompanyDetails(companyId: string) {
        if (companyId == null) return; // Skip this if not given.

        this.companyService.getById(companyId)
            .subscribe(success => {
                debugger;
                $('.loading').hide();
                console.log("Company details:", companyId, success)
                this.company = success;
                this.company.companyName = this.company.companyName.toLocaleUpperCase();
                this.stripeCountryId = this.company.stripeCountryID;
            }, error => {
            });
    }

    navigate(step: RegistrationStep) {
        if (this.skipType) {
            $('.loading').css('background-color', '#fff');
        }
        $('.loading').show();
        this.step = step;
        this.tutorsService.updateInitialRegisterStep(this.step)
            .subscribe(success => {
                if (success != null) {
                    this.tutorInitialRegistrationStep = success.initialRegistrationStep;
                    this.isRegistrationDone = success.initialRegistrationComplete;
                }
            }, error => {
                this.toastr.error("Error occurred. Please refresh page and retry.");
                console.log(error);
            });


        if (this.step == RegistrationStep.BasicInfo) {
            this.moveToStep('dvbasicInfo');
            this.enumsService.get('UserTitle')
                .subscribe(success => {
                    this.userTitles = success;
                }, error => {
                });
            this.tutorsService.getBasicInfo()
                .subscribe(success => {
                    debugger;
                    this.currentCompany = success.currentCompany; // can be null..
                    this.preventJoiningAnotherCompany();

                    this.basicInfoFormSubmitted = false;
                    this.basicInfoForm = this.fb.group({
                        userId: [success.userId],
                        title: [success.title, [Validators.required, Validators.maxLength(250)]],
                        stripeCountryId: [this.stripeCountryId, [Validators.required]],
                        firstName: [success.firstName, [Validators.required, Validators.maxLength(20)]],
                        lastName: [success.lastName, [Validators.required, Validators.maxLength(20)]],
                        telephoneNumber: [success.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        email: [{ value: success.email, disabled: true }],
                        dateOfBirthDay: [success.dateOfBirthDay, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
                        dateOfBirthMonth: [success.dateOfBirthMonth, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
                        dateOfBirthYear: [success.dateOfBirthYear, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4)]],
                        mobileNumber: [success.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
                        termsAndConditionsAccepted: [Boolean(success.termsAndConditionsAccepted), [Validators.required]],
                        marketingAccepted: [success.marketingAccepted, []],
                        //wizcraft
                        platFormUse: ['3'],

                    });
                    $('.loading').hide();
                }, error => {
                });
            
        }
        else if (this.step == RegistrationStep.Payment) {
            this.setupPaymentsPage();
            $('.loading').hide();
           
        }
        else if (this.step == RegistrationStep.PaymentApproved) {
            this.tutorsService.getMy()
                .subscribe(success => {
                    if (success != null) {
                        this.tutorId = success.tutorId;
                        this.tutorFirstName = success.userFirstName;
                        $('.loading').hide();
                    }
                }, error => {
                });
        }
        else if (this.step == RegistrationStep.DBSCheck) {
            this.tutorsService.getMy()
                .subscribe(success => {

                    this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
                        this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
                        this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
                        if (!this.dbsCheckAllowedInSubscriptoin) {
                            //this.submitDbsCheckForm('skip')
                            let objFormDatas = {
                                tutorId: success.tutorId,
                                hasDbsCheck: false,
                                dbsCertificateNumber: ''
                            }


                            this.tutorsService.saveDbsCheck(objFormDatas)
                                .subscribe(success => {
                                    $('.loading').hide();
                                    this.navigate(12);
                                }, error => {
                                });
                        } else {
                            this.tutorId = success.tutorId;
                            this.dbsCheckFormSubmitted = false;
                            this.dbsCheckForm = this.fb.group({
                                tutorId: [success.tutorId],
                                userFirstName: [success.userFirstName],
                                hasDbsCheck: [success.hasDbsCheck],
                                dbsCertificateNumber: [success.dbsCertificateNumber, [Validators.maxLength(250)]],
                                ProfileApprovalRequired: [0],
                            });
                            //this.getSubscription();
                            $('.loading').hide();
                        }
                    }, err => {
                    })
                }, error => {
                });
            //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
            //    this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
            //    this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
            //}, err => {

            //})
            this.moveToStep();
        }
        else if (this.step == RegistrationStep.Profile) {

            this.tutorsService.getMy()
                .subscribe(success => {
                    this.tutorId = success.tutorId;
                    this.tutorStoreProfileImageDownload = success.storeProfileImageDownload;
                    this.profileOneFormSubmitted = false;
                    this.profileOneForm = this.fb.group({
                        tutorId: [success.tutorId],
                        userFirstName: [success.userFirstName],
                        header: [success.header, [Validators.required, Validators.maxLength(99)]],
                        //subHeader: [success.subHeader, [Validators.required, Validators.maxLength(1999)]],
                        biography: [success.biography, [Validators.required, Validators.maxLength(1999)]],
                    });
                    //if (!this.ProfileApprovalRequired) {
                    //    this.submitProfileOneForm('skip');
                    //    this.skipType = true;
                    //    //this.navigate(12);
                    //    return;
                    //}
                    this.profileTwoFormSubmitted = false;
                    this.profileTwoForm = this.fb.group({
                        tutorId: [success.tutorId],
                        userFirstName: [success.userFirstName],
                        profileTeachingExperiance: [success.profileTeachingExperiance, [Validators.maxLength(1999)]],
                        profileHowITeach: [success.profileHowITeach, [Validators.maxLength(1999)]],
                    });
                    $('.loading').hide();
                }, error => {
                });
            this.moveToStep();
        }
        else if (this.step == RegistrationStep.Qualifications) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(9);
            //    return;
            //}
            this.resetQualificationForm();
            this.tutorCertificatesService.getByTutor(this.tutorId)
                .subscribe(success => {
                    this.tutorCertificates = success;
                }, error => {
                });
            this.moveToStep();
           
        }
        else if (this.step == RegistrationStep.Subjects) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(10);
            //    return;
            //}
            //this.resetSubjectForm();
            //this.subjectsService.getOptions()
            //    .subscribe(success => {
            //        this.subjects = success;
            //    }, error => {
            //    });
            //this.subjectCategoriesService.getOptions()
            //    .subscribe(success => {
            //        this.subjectCategorys = success;
            //    }, error => {
            //    });
            //location.reload();
            //$('.loading').show();
          

            this.moveToStep();
        }
        else if (this.step == RegistrationStep.Availability) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(11);
            //    return;
            //}

            $('.loading').show();
            this.tutorsService.getAvailability(this.tutorId).subscribe(respt => {
                this.registerdEvents = respt;
                $('.loading').hide();
            }, error => {

            });

            this.moveToStep();
        }
        else if (this.step == RegistrationStep.Preview) {
            //if (!this.ProfileApprovalRequired) {
            //    this.navigate(12);
            //    return;
            //}
            $('.loading').hide();
        }
        else if (this.step == RegistrationStep.Finish) {
            $('.loading').hide();
        }
    }

    preventJoiningAnotherCompany() {
        if (this.journeyType == RegistrationJourneyType.TutorJoiningCompany) {
            if (this.currentCompany != null && this.company != null && this.company.companyId != this.currentCompany.companyId)
                window.location.href = "/home/forbidden?AlreadyJoinedAnotherCompany";
        }
    }

    setupPaymentsPage() {
        if (this.journeyType == RegistrationJourneyType.TutorRegistration) {


            this.setupCardPaymentPage();
            this.moveToStep('dvPayment');
        }
        else {
            this.setupBankDetailsPage();
            this.moveToStep('dvBankDetail');

        }
    }

    setupBankDetailsPage() {
        this.tutorsService.getMy()
            .subscribe(success => {
                this.tutorId = success.tutorId;
                this.bankDetailsFormSubmitted = false;
                this.bankDetailsForm = this.fb.group({
                    bankAccountNumber: [success.bankAccountNumber, [Validators.required, Validators.maxLength(20)]],
                    bankSortCode: [success.bankSortCode, [Validators.required, Validators.maxLength(10)]],
                    addressLine1: [success.addressLine1, [Validators.required, Validators.maxLength(250)]],
                    postCode: [success.postCode, [Validators.required, Validators.maxLength(10)]],
                });
            }, error => { });
    }

    setupCardPaymentPage() {

        this.tutorsService.getMy()
            .subscribe(success => {
                if (success != null && success.paymentStatus == 'Paid') {
                    this.navigate(RegistrationStep.PaymentApproved);
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
                                paymentMethodId: [''],
                                intentId: [''],
                                stripeSubscriptionId: [''],
                                intentClientSecret: [''],
                                stripeCustomerId: [''],
                                requiresAction: [false],
                                promoCode: [null, [Validators.maxLength(250)]]
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

    //getSubscription() {

    //    this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
    //        this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
    //        this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
    //         
    //        if (!this.dbsCheckAllowedInSubscriptoin) {
    //            //this.submitDbsCheckForm('skip')
    //            //this.navigate(12);
    //            this.isApproved = true;
    //        } else {
    //            this.isApproved = false;
    //        }
    //    }, err => {
    //    })
    //}

    submitBasicInfoForm() {
        debugger;
        this.basicInfoFormSubmitted = true;
        if (this.basicInfoForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            $('.loading').show();
            let basicInfo = {};
            // basicInfo = {
            //    ...this.basicInfoForm.getRawValue(),
            //    dateOfBirth: new Date(Date.parse(this.getDateString())),
            //    joiningCompanyId: this.companyId
            //};
            if (this.companyId && this.journeyType == 3) {
                basicInfo = {
                    ...this.basicInfoForm.getRawValue(),
                    dateOfBirth: new Date(Date.parse(this.getDateString())),
                    joiningCompanyId: this.companyId,
                    IDVerificationtStatus: 99,
                    platFormUse: Number(this.basicInfoForm.getRawValue().platFormUse)
                };
            }
            else {
                basicInfo = {
                    ...this.basicInfoForm.getRawValue(),
                    dateOfBirth: new Date(Date.parse(this.getDateString())),
                    joiningCompanyId: this.companyId,
                    stripePlanId: this.stripePlan != null ? this.stripePlan.stripePlanId : '',
                    IDVerificationtStatus: 0,
                    platFormUse: Number(this.basicInfoForm.getRawValue().platFormUse)
                };
            }

            debugger;

            this.tutorsService.saveBasicInfo(basicInfo)
                .subscribe(success => {
                    if (this.companyId && this.journeyType == 3) {
                        this.navigate(RegistrationStep.Payment);
                    } else if (this.stripePlan?.subscription.subscriptionPrice > 0) {
                        debugger;
                        let objFormData = {
                            tutorId: success,
                            IsProfileCheck: true,
                            ProfileApprovalRequired: 0,
                            hasDbsCheck: true, //make false in future for full process of register tutor
                            dbsCertificateNumber: '',
                        }
                        this.tutorsService.saveDbsCheck(objFormData)
                            .subscribe(success => {
                                $('.loading').hide();
                                this.navigate(12);
                            }, error => {
                            });
                    }
                    else {
                        //this.skipType = true;
                        //this.navigate(RegistrationStep.DBSCheck);
                        this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
                            this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
                            this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
                            debugger;
                            if (!this.dbsCheckAllowedInSubscriptoin) {
                                //this.submitDbsCheckForm('skip')
                                let objFormData = {
                                    tutorId: success,
                                    hasDbsCheck: false,
                                    dbsCertificateNumber: '',
                                    IsProfileCheck: true,
                                    //ProfileApprovalRequired: this.ProfileApprovalRequired ? 0 : 99
                                    ProfileApprovalRequired: 0
                                }
                                this.tutorsService.saveDbsCheck(objFormData)
                                    .subscribe(success => {
                                        $('.loading').hide();
                                        this.navigate(12);
                                    }, error => {
                                    });
                            } else {
                                debugger;
                                let objFormData = {
                                    IsProfileCheck: true,
                                    //ProfileApprovalRequired: this.ProfileApprovalRequired ? 0 : 99
                                    ProfileApprovalRequired: 0
                                }
                                this.tutorsService.saveDbsCheck(objFormData)
                                    .subscribe(success => {
                                        $('.loading').hide();
                                        this.navigate(12);
                                    }, error => {
                                    });
                                this.navigate(RegistrationStep.DBSCheck);
                            }
                        }, err => {
                        })
                    }

                }, error => {
                    $('.loading').hide();
                    this.toastr.error('Please enter a valid date of birth');
                });
        }
        this.moveToStep();
    };

    submitBankDetailsForm() {
        this.bankDetailsFormSubmitted = true;
        if (this.bankDetailsForm.valid) {
            this.tutorsService.saveBankDetail(this.bankDetailsForm.getRawValue())
                .subscribe(success => {
                    this.navigate(RegistrationStep.DBSCheck);
                }, err => { }, () => {
                    $('.loading').hide();
                });
        }
        this.moveToStep();
    }

    submitPaymentForm() {
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.createPaymentCard();
        }
        this.moveToStep();
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

    // "Apply" button click handler
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
            this.paymentCardResponse(response);
        });
    };

    paymentCardResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        } else {
            this.step = RegistrationStep.PaymentProcessing;
            $('.loading').hide();
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };

    confirmSubscriptionSend(): void {
        $('.loading').show();
        this.tutorsService.savePayment(this.paymentForm.getRawValue())
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
                this.step = RegistrationStep.PaymentFailed;
                this.cardActionResponse(response);
            });
        } else {
            this.step = RegistrationStep.PaymentApproved;
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
        this.step = RegistrationStep.Payment;
        this.setupCardField();
    };

    hasDbsCheckValueChange() {
        this.dbsCheckForm.get('dbsCertificateNumber').clearValidators();
        if (this.dbsCheckFormControls.hasDbsCheck.value == true) {
            this.dbsCheckForm.get('dbsCertificateNumber').setValidators([Validators.required, Validators.maxLength(250)]);
        }

        this.dbsCheckForm.get('dbsCertificateNumber').updateValueAndValidity();
    };

    submitDbsCheckForm(type = '') {

        let objFormData = this.dbsCheckForm.getRawValue();
        //if (type == 'skip') {
        //    objFormData.hasDbsCheck = false;
        //}
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            $('.loading').show();
            this.tutorsService.saveDbsCheck(objFormData)
                .subscribe(success => {
                    this.navigate(RegistrationStep.Profile);
                }, error => {
                });
        }
    };

    submitProfileOneForm(type = '') {

        this.profileOneFormSubmitted = true;
        if (this.profileOneForm.valid || type == 'skip') {
            $('.loading').show();
            this.tutorsService.saveProfileOne(this.profileOneForm.getRawValue())
                .subscribe(success => {
                    this.profileFormSubStep = 2;
                    //if (!this.ProfileApprovalRequired) {
                    //    this.navigate(12);
                    //}
                    $('.loading').hide();
                }, error => {
                });
        }
        this.moveToStep();
    };

    submitProfileTwoForm() {
        this.profileTwoFormSubmitted = true;
        if (this.profileTwoForm.valid) {
            $('.loading').show();
            this.tutorsService.saveProfileTwo(this.profileTwoForm.getRawValue())
                .subscribe(success => {
                    this.profileFormSubStep = 3;
                    $('.loading').hide();
                }, error => {
                });
        }
        this.moveToStep();
    };

    public fileOverProfileThreeUploader(e: any): void {
        this.profileThreeDropZoneOver = e;
    }

    public profileThreeUploaderFileDropped(e: any): void {
        debugger;
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/
        let index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
        this.imageChangedEvent = e;
    }

    submitProfileThreeForm() {
        if (this.profileThreeUploader.queue.length > 0) {
            debugger;
            $('.loading').show();
            /*const date: number = new Date().getTime();
            const file = new File([this.croppedProfileImage], 'photo', { type: 'image/png', lastModified: date });
            const fileItem = new FileItem(this.profileThreeUploader, file, {});
            this.profileThreeUploader.queue.push(fileItem);*/

            //fileItem.upload();
            /*this.profileThreeUploader.onBeforeUploadItem = (item) => {
                debugger;
                item.withCredentials = false;
            }*/

            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;

            this.profileThreeUploader.onErrorItem = () => {
                $('.loading').hide();
                this.toastr.error('We were unable to upload your profile picture');
            }
            this.profileThreeUploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.profileThreeUploader.clearQueue();
                    this.profileThreeUploaderShow = true;
                    this.navigate(RegistrationStep.Qualifications);
                } else {
                    $('.loading').hide();
                    this.toastr.error('We were unable to upload your profile picture');
                }
            }
        } else if (this.tutorStoreProfileImageDownload != null && this.tutorStoreProfileImageDownload.length > 0) {
            $('.loading').show();
            this.navigate(RegistrationStep.Qualifications);
        }
        else {
            this.toastr.error('Please upload a profile picture to continue');
        }
        this.moveToStep();
    };

    resetQualificationForm() {
        this.tutorQualificationsService.getByTutor(this.tutorId)
            .subscribe(success => {
                this.tutorQualifications = success;
                this.qualificationFormSubmitted = false;
                this.qualificationForm = this.fb.group({
                    tutorId: [this.tutorId],
                    name: ['', [Validators.required, Validators.maxLength(250)]],
                });
                $('.loading').hide();
            }, error => {
            });
    };

    submitQualificationForm() {
        this.qualificationFormSubmitted = true;
        if (this.qualificationForm.valid) {
            $('.loading').show();
            this.tutorQualificationsService.create(this.qualificationForm.getRawValue())
                .subscribe(success => {
                    this.resetQualificationForm();
                }, error => {
                });
        }
        this.moveToStep();
    };

    deleteTutorQualification(tutorQualification: TutorQualification) {
        $('.loading').show();
        this.tutorQualificationsService.delete(tutorQualification.tutorQualificationId)
            .subscribe(success => {
                this.tutorQualificationsService.getByTutor(this.tutorId)
                    .subscribe(success => {
                        this.tutorQualifications = success;
                        $('.loading').hide();
                    }, error => {
                    });
            }, error => {
            });
    };

    public fileOverQualificationFormUploader(e: any): void {
        this.qualificationFormDropZoneOver = e;
    }

    public qualificationFormUploaderFileDropped(e: any): void {
        console.log(this.qualificationFormUploader.queue);
        if (this.qualificationFormUploader.queue.length > 0) {
            $('.loading').show();
            this.qualificationFormUploader.uploadAll();
            this.qualificationFormUploaderShow = false;
            this.qualificationFormUploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.qualificationFormUploader.clearQueue();
                    this.qualificationFormUploaderShow = true;
                    this.tutorCertificatesService.getByTutor(this.tutorId)
                        .subscribe(success => {
                            this.tutorCertificates = success;
                            $('.loading').hide();
                        }, error => {
                        });
                } else {
                    $('.loading').hide();
                    this.qualificationFormUploader.clearQueue();
                    this.qualificationFormUploaderShow = true;
                    this.toastr.error('We were unable to upload your document');
                }
            }
        }
        else {
            this.toastr.error('Only PDF, PNG and JPEG allowed');
        }
    }

    deleteTutorCertificate(tutorCertificate: TutorCertificate) {
        $('.loading').show();
        this.tutorCertificatesService.delete(tutorCertificate.tutorCertificateId)
            .subscribe(success => {
                this.tutorCertificatesService.getByTutor(this.tutorId)
                    .subscribe(success => {
                        this.tutorCertificates = success;
                        $('.loading').hide();
                    }, error => {
                    });
            }, error => {
            });
    };

    resetSubjectForm() {
        this.tutorSubjectsService.getByTutor(this.tutorId)
            .subscribe(success => {
                this.tutorSubjects = success;
                this.subjectFormSubmitted = false;
                this.subjectForm = this.fb.group({
                    tutorId: [this.tutorId],
                    subjectId: [null, [Validators.required]],
                    subjectCategoryId: [null, []],
                    tutorSubjectStudyLevels: this.fb.array([])
                });
                this.studyLevelsService.getOptions()
                    .subscribe(studyLevelsSuccess => {
                        for (var i = 0; i < studyLevelsSuccess.length; i++) {
                            const tutorSubjectStudyLevel = this.fb.group({
                                studyLevelId: [studyLevelsSuccess[i].id, []],
                                name: [studyLevelsSuccess[i].name, []],
                                checked: [false, []],
                            });

                            this.tutorSubjectStudyLevelsFormArrayControls.push(tutorSubjectStudyLevel);
                        }
                    }, error => {
                    });
                $('.loading').hide();
            }, error => {
            });
        this.moveToStep();
    };

    getSubjectCategorys() {
        if (this.subjectForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.subjectForm.get('subjectId').value)
                .subscribe(success => {
                    this.subjectCategorys = success;
                    $('.loading').hide();
                }, error => {
                });
        }
    };

    submitSubjectForm() {
        this.subjectFormSubmitted = true;
        if (this.subjectForm.valid) {
            if (this.tutorSubjectStudyLevelsFormArrayControls.value.filter(u => u.checked == true).length > 0) {
                $('.loading').show();
                this.tutorSubjectsService.create(this.subjectForm.getRawValue())
                    .subscribe(success => {
                        this.resetSubjectForm();
                    }, error => {
                    });
            } else {
                this.toastr.error('Please select at least 1 level to save a subject');
            }
        }
        this.moveToStep();
    };

    deleteTutorSubject(tutorSubject: TutorSubject) {
        $('.loading').show();
        this.tutorSubjectsService.delete(tutorSubject.tutorSubjectId)
            .subscribe(success => {
                this.resetSubjectForm();
            }, error => {
            });
    };

    getStripePlanDetails(stripePlanId: string): void {
        if (stripePlanId == null) return; // Skip this if not given.

        this.stripePlansService.getById(stripePlanId)
            .subscribe(success => {
                $('.loading').hide();
                console.log("StripePlanId and result:", stripePlanId, success)
                this.stripePlan = success;
            }, error => {
            });
    }

    //getSubscription() {

    //    this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
    //        this.dbsCheckAllowedInSubscriptoin = res.adminDashboard_DBSApproval_ApprovalRequired;
    //        this.ProfileApprovalRequired = res.adminDashboard_ProfileApproval_ApprovalRequired;
    //         
    //        if (!this.dbsCheckAllowedInSubscriptoin) {
    //            this.skipType = true;
    //            this.submitDbsCheckForm('skip');
    //            this.skipType = true;
    //            //this.navigate(7);
    //        }
    //    }, err => {
    //    })

    //}

    getSubscriptionName(): string {
        if (this.stripePlan && this.stripePlan.subscription && this.stripePlan.subscription.subscriptionName)
            return this.stripePlan.subscription.subscriptionName;
        else return "";
    }

    submitCalendarData() {

        $('.loading').show();
        let obj = this.calendarRef.addedEvents;
        if (this.calendarRef.deletedEvents.length > 0) {
            Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
        }

        this.tutorsService.saveAvailability(obj).subscribe(success => {
            //this.navigate(this.registerStep.Preview)
            this.navigate(this.registerStep.Finish)
            $('.loading').hide();
        }, error => {
            //this.navigate(this.registerStep.Preview)
            this.navigate(this.registerStep.Finish)
            $('.loading').hide();
        });
        this.moveToStep();
    }

    //add price setup
    addPriceForSubjectsTutors() {

        const dialogRef = this.dialog.open(SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            width: '100%',
            panelClass: 'myClass',
            autoFocus: false,
            data: {}
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                //this.getSubjectStudyLevelSetupData();
            }
        });
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    /*imageCropped(event: ImageCroppedEvent) {
        debugger;
        this.profileThreeUploaderPreviewUrl = event.base64;
        this.croppedProfileImage = this.b64toBlob(event.base64);
    }*/

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
    imageLoaded(image: HTMLImageElement) {
        debugger;
        //$('.source-image').parent().css('max-width', 500);
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    moveToStep(dvId = 'dvInfo') {

        let innerHeight = window.innerHeight;
        let innerWidth = window.innerWidth;
        
        if (innerWidth <= 967) {
            //console.log("Height:" + innerHeight + " " + "Width:" + innerWidth);
            setTimeout(function () {
                var $container = $("html,body");
                var $scrollTo = $('#' +dvId);
                $container.animate({ scrollTop: $scrollTo.offset().top, scrollLeft: 0 }, 1000);
            }, 500);

        }
    }

}
