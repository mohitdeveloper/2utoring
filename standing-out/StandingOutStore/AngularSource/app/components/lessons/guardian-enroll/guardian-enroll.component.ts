import { Component, OnInit } from '@angular/core';
import { LessonCard, UserDetail, UserGuardianDetail, GuardianRegistrationStep, EnumOption } from '../../../models/index';
import { ClassSessionsService, UsersService, CoursesService, EnumsService, SettingsService } from '../../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LessonEnrollModal, LessonEnrollLinkedAccountModal } from '../../../partials';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var title: any;
declare var courseId: any;
//declare var classSessionId: any;
declare var cameFromLinkAccount: any;

@Component({
    selector: 'app-guardian-enroll',
    templateUrl: './guardian-enroll.component.html'
})

export class GuardianEnrollComponent implements OnInit {
    constructor(private coursesService: CoursesService, private classSessionsService: ClassSessionsService, private usersService: UsersService, private enumsService: EnumsService,
        private formBuilder: FormBuilder, private modalService: NgbModal, private settingsService: SettingsService) {
        //if (localStorage.getItem('uniqueNumber') != '') {
        //    window.location.href = '/my-course'
        //}
    }

    title: string = title;
    courseId: string = courseId;
    //classSessionId: string = classSessionId;
    step: GuardianRegistrationStep = GuardianRegistrationStep.GuardianDetail;
    get guardianRegistrationStep() { return GuardianRegistrationStep; }; 

    lesson: LessonCard = null;
    course: LessonCard = null;
    user: UserGuardianDetail = null;
    userTitles: EnumOption[] = [];
    cameFromLinkAccount: string = cameFromLinkAccount;
    isSupportedPayout: boolean = true;
    userStripeCountryId: string = null;
    conversionPercent: number = 0;
    conversionFlat: number = 0;
    guardianDetailForm: FormGroup;
    guardianDetailFormSubmitted: boolean;
    get guardianDetailFormControls() { return this.guardianDetailForm.controls; };

    childDetailForm: FormGroup;
    childDetailFormSubmitted: boolean;
    get childDetailFormControls() { return this.childDetailForm.controls; };

    getLessonCard(classSessionId): void {
        this.classSessionsService.getCard(classSessionId)
            .subscribe(success => {
                this.lesson = success;
                this.checkGoogleAccount();
            }, error => {
                console.log(error);
            });
    };
    getSetting(): void {
        this.settingsService.getSetting().subscribe(success => {
            this.conversionPercent = success.conversionPercent;
            this.conversionFlat = success.conversionFlat;
        });

    }
    getUser(): void {
        this.usersService.getMyGuardian()
            .subscribe(success => {
                this.user = success;
                if (!this.user.isSetupComplete) {
                    this.setupGuardianDetailForm(this.user);
                    this.setupChildDetailForm(this.user);
                }
                this.checkGoogleAccount();
                 debugger;
                if (this.user.stripeCountry != null) {
                    if (this.user.stripeCountry.supportedPayout == true) {
                        this.isSupportedPayout = true;
                        this.userStripeCountryId = this.user.stripeCountry.stripeCountryId;
                    }
                    else {
                        this.isSupportedPayout = false;
                        this.userStripeCountryId = this.user.stripeCountry.stripeCountryId;
                    }
                }
            }, error => {
                console.log(error);
            });
    };
    getSupportedPayout(supportedPayout: any) {
        this.isSupportedPayout = supportedPayout;
    }
    getUserTitel(): void {
        this.enumsService.get('UserTitle')
            .subscribe(success => {
                this.userTitles = success;
            }, error => {
            });
    }
    // #region User First Time Setup

    setupGuardianDetailForm(user: UserGuardianDetail): void {
        this.guardianDetailForm = this.formBuilder.group({
            parentTitle: [user.childTitle, [Validators.required]],
            firstName: [user.firstName, [Validators.required, Validators.maxLength(250)]],
            lastName: [user.lastName, [Validators.required, Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            termsAndConditionsAccepted: [false, [Validators.requiredTrue]]
        });
    };
    setupChildDetailForm(user: UserGuardianDetail): void {
        this.childDetailForm = this.formBuilder.group({
            childTitle: [user.childTitle, [Validators.required]],
            childFirstName: [user.childFirstName, [Validators.required, Validators.maxLength(250)]],
            childLastName: [user.childLastName, [Validators.required, Validators.maxLength(250)]],

            dateOfBirthDay: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
            dateOfBirthMonth: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
            dateOfBirthYear: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4)]],
        });
    };

    checkDateValid(): boolean {
        // Basic validation checks
        if (this.childDetailForm.controls.dateOfBirthYear.errors || this.childDetailForm.controls.dateOfBirthMonth.errors || this.childDetailForm.controls.dateOfBirthDay.errors) {
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
        if (this.course == null) {
            return false;
        }
        else if (this.checkDateValid()) {
            if (this.course.isUnder18) {
                let dateOfBirth: Date = new Date(Date.parse(this.getDateString()));
                let dateToMatch: Date = (new Date());
                console.log(dateToMatch);
                console.log(dateToMatch.getDay());

                dateToMatch.setFullYear(dateToMatch.getFullYear() - 19);

                //dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
                console.log(dateToMatch);
                if (dateOfBirth < dateToMatch) {
                    return true;
                }
            }
            else {
                let dateOfBirth: Date = new Date(Date.parse(this.getDateString()));
                let dateToMatch: Date = (new Date());
                dateToMatch = new Date(dateToMatch.getFullYear() - 17, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
                if (dateOfBirth > dateToMatch) {
                    return true;
                }
            }
        }
        return false;
    };

    getDateString(): string {
        return this.childDetailForm.controls.dateOfBirthYear.value + '-' +
            (this.childDetailForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.childDetailForm.controls.dateOfBirthMonth.value + '-' +
            (this.childDetailForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.childDetailForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };

    submitGuardianDetailForm(): void {
        this.guardianDetailFormSubmitted = true;
        if (this.guardianDetailForm.valid) {
            this.step = GuardianRegistrationStep.ChildDetail;
        }
    };
    submitChildDetailForm(): void {
        this.childDetailFormSubmitted = true;
        if (this.childDetailForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            this.usersService.completeGuardianSetup({ ...(this.childDetailForm.value), childDateOfBirth: new Date(Date.parse(this.getDateString())), ...(this.guardianDetailForm.value) })
                .subscribe(success => {
                    this.user = success;
                }, error => {
                        console.log(error);
                });
        }
    };

    back(): void {
        if (this.step == GuardianRegistrationStep.GuardianDetail) {
            window.location.href = '/find-a-lesson' + (this.lesson.isUnder16 ? '?under16=true' : '');
        }
        else if (this.step == GuardianRegistrationStep.ChildDetail) {
            this.step = GuardianRegistrationStep.GuardianDetail
        }
    };

    // #endregion User First Time Setup

    ngOnInit() {
        this.getSetting();
        this.getUser();
        this.getUserTitel();
        //this.getLessonCard();
        this.getCourse();
    };

    getCourse() {

        this.coursesService.getPurchaseCouresData(courseId)
            .subscribe(success => {
                debugger;

                this.getLessonCard(success.classSessions[0].classSessionId);
                this.course = success;
                this.checkGoogleAccount();
            }, error => {
                console.log(error);
            });
    }

    checkGoogleAccount() {
        if (this.course != undefined && this.course.requiresGoogleAccount == true && this.user != undefined && this.user.hasGoogleAccountLinked == false) {
            const modalRef = this.modalService.open(LessonEnrollModal, { size: 'lg' });

            modalRef.result.then((result) => {
            }, (reason) => {
            });
        } else if (this.cameFromLinkAccount == 'True' && this.user.hasGoogleAccountLinked == true) {
            const modalRef = this.modalService.open(LessonEnrollLinkedAccountModal, { size: 'md' });

            modalRef.result.then((result) => {
            }, (reason) => {
            });
        }
    };
}
