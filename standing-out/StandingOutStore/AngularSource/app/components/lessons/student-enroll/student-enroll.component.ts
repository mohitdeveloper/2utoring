import { Component, OnInit } from '@angular/core';
import { LessonCard, UserDetail, EnumOption } from '../../../models/index';
import { ClassSessionsService, UsersService, CoursesService, EnumsService} from '../../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesHelper } from '../../../helpers';
import { LessonEnrollModal, LessonEnrollLinkedAccountModal } from '../../../partials';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { StripeCountry } from '../../../models';

declare var title: any;
declare var courseId: any;
//declare var classSessionId: any;
declare var cameFromLinkAccount: any;


@Component({
    selector: 'app-student-enroll',
    templateUrl: './student-enroll.component.html'
})

export class StudentEnrollComponent implements OnInit {
    constructor(private coursesService: CoursesService, private classSessionsService: ClassSessionsService, private usersService: UsersService, private enumsService: EnumsService, private formBuilder: FormBuilder, private utilities: UtilitiesHelper, private modalService: NgbModal) {
        //if (localStorage.getItem('uniqueNumber') != '') {
        //    window.location.href = '/my-course'
        //}
    }

    title: string = title;
    courseId: string = courseId
    //classSessionId: string = classSessionId;
    lesson: LessonCard = null;
    course: LessonCard = null;
    user: UserDetail = null;
    userTitles: EnumOption[] = [];
    cameFromLinkAccount: string = cameFromLinkAccount;
    //stripeCountrys: StripeCountry[] = [];
    //stripeCountryId: string = '0: 87017cf8-e86a-4a98-191b-08d7e6c57416';
    userDetailForm: FormGroup;
    userDetailFormSubmitted: boolean;
    get userDetailFormControls() { return this.userDetailForm.controls; };

    getLessonCard(classSessionId): void {
        this.classSessionsService.getCard(classSessionId)
            .subscribe(success => {
                this.lesson = success;
               this.checkGoogleAccount();
            }, error => {
                console.log(error);
            });
    };

    getUser(): void {
        this.usersService.getMy()
            .subscribe(success => {
                this.user = success;
                if (!this.user.isSetupComplete) {
                    this.setupUserDetailForm(this.user);
                }
                this.checkGoogleAccount();
            }, error => {
                console.log(error);
            });
    };
    getUserTitel(): void {
        this.enumsService.get('UserTitle')
            .subscribe(success => {
                this.userTitles = success;
            }, error => {
            });
    }
    // #region User First Time Setup

    setupUserDetailForm(user: UserDetail): void {
        this.userDetailForm = this.formBuilder.group({
            title: [user.title, [Validators.required]],
            //stripeCountryId: [this.stripeCountryId, [Validators.required]],
            firstName: [user.firstName, [Validators.required, Validators.maxLength(250)]],
            lastName: [user.lastName, [Validators.required, Validators.maxLength(250)]],
            //childFirstName: ['', [Validators.required, Validators.maxLength(250)]],
            //childLastName: ['', [Validators.required, Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            termsAndConditionsAccepted: [false, [Validators.requiredTrue]],

            dateOfBirthDay: [new Date(user.dateOfBirth).getDate(), [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
            dateOfBirthMonth: [new Date(user.dateOfBirth).getMonth() + 1, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(2)]],
            dateOfBirthYear: [new Date(user.dateOfBirth).getFullYear(), [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4)]],
        });
    };

    checkDateValid(): boolean {
        // Basic validation checks
        if (this.userDetailForm.controls.dateOfBirthYear.errors || this.userDetailForm.controls.dateOfBirthMonth.errors || this.userDetailForm.controls.dateOfBirthDay.errors) {
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
                dateToMatch = new Date(dateToMatch.getFullYear() - 19, dateToMatch.getMonth(), dateToMatch.getDay()); // Allow 18 year olds
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
        return this.userDetailForm.controls.dateOfBirthYear.value + '-' +
            (this.userDetailForm.controls.dateOfBirthMonth.value < 10 ? '0' : '') + this.userDetailForm.controls.dateOfBirthMonth.value + '-' +
            (this.userDetailForm.controls.dateOfBirthDay.value < 10 ? '0' : '') + this.userDetailForm.controls.dateOfBirthDay.value + 'T00:00:00.000Z';
    };

    submitUserDetailForm(): void {
        debugger;
        //return;
        this.userDetailFormSubmitted = true;
        if (this.userDetailForm.valid && this.checkDateValid() && !this.dateOfBirthInvalid()) {
            this.usersService.completeStudentSetup({ ...this.userDetailForm.value, dateOfBirth: new Date(Date.parse(this.getDateString())) })
                .subscribe(success => {
                    this.user = success;
                }, error => {
                    console.log(error);
                });
        }
    };

    // #endregion User First Time Setup

    ngOnInit() {
        this.getUser();
        this.getUserTitel();
       // this.getLessonCard();    
        //get course details
        this.getCourse();
        //this.stripeCountrysService.get()
        //    .subscribe(countrySuccess => {
        //        this.stripeCountrys = countrySuccess;
        //    });
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
        } else if (this.course != undefined && this.user != undefined && this.cameFromLinkAccount == 'True' && this.user.hasGoogleAccountLinked == true) {
            const modalRef = this.modalService.open(LessonEnrollLinkedAccountModal, { size: 'md' });

            modalRef.result.then((result) => {
            }, (reason) => {
            });
        }
    };

    back() {
        window.location.href = '/find-a-lesson' + (this.course.isUnder18 ? '?isUnder18=true' : '');
    };
    //backToFirstPage() {
    //    $('#myFirstPage').css('display', 'block');
    //    $('#mySecondPage').css('display', 'none');
    //}
    //comeToNextPage() {
    //    $('#myFirstPage').css('display', 'none');
    //    $('#mySecondPage').css('display', 'block');
    //}


}
