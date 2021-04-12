import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { TutorsService, TutorQualificationsService, TutorSubjectsService, UsersService, subjectImages, CompanyService } from '../../../services';
import { Tutor, TutorQualification, TutorSubject } from '../../../models';
import * as $ from "jquery";
import { CalenderComponent } from '../../calender/calender.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var isAuthenticated: any;
@Component({
    selector: 'app-tutor-profile-view',
    templateUrl: './tutor-profile-view.component.html',
    styleUrls: ['./tutor-profile-view.component.scss']
})
export class TutorProfileViewComponent implements OnInit {
    @ViewChild('calendarRef') calendarComponent: CalenderComponent;
    @Input() tutorId: string;
    @Input() showEditButton: boolean;

    isAuthenticated = isAuthenticated;

    loaded: number = 0;
    toLoad: number = 3;
    tutor: Tutor;
    qualifications: TutorQualification[] = [];
    subjects: string[] = [];
    screenSize: number;
    scrHeight: any;
    scrWidth: any;
    selectedTutorsData: any = [];
    isBookedSlotVisible: boolean = true;
    fromSettingPage: boolean = false;
    editSlot: boolean = false;
    isLoggedInUser: boolean;

    profileTabActive = 'tab1';

    //url: string = window.location.hostname;
    url: string = window.location.origin;
    registerdEvents: any;
    bookedSlot: any;
    ProfileApproval: boolean;
    dataLimit: number = 10;
    currentLimit: number = this.dataLimit;
    subjectsImages = subjectImages;
    contactTutor: FormGroup;
    contactTutorFormSubmitted: boolean = false;
    get contactTutorFormControls() { return this.contactTutor.controls };

    alertMessage: any = null;
    constructor(private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private tutorQualificationsService: TutorQualificationsService, private tutorSubjectsService: TutorSubjectsService, private usersService: UsersService, private companyService: CompanyService) { }
    
    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

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
        console.log(this.scrHeight, this.scrWidth);

        if (this.scrWidth <= 1025) {
            setTimeout(() => {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 300)
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


    ngOnInit(): void {
        this.getScreenSize();
        let tid = localStorage.getItem('tid');
        if (tid) {
            localStorage.removeItem('tid');
        }
        $('.loading').show();

        this.getUserAlertMessage();
        this.getTutorAvailability()

        if (localStorage.getItem('expCourses') == 'True') {
            this.profileTabActive = 'tab2';
        }

        this.contactTutor = this.fb.group({
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            receiverEmail: [''],
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.maxLength(20)]],
            message: ['', [Validators.required, Validators.maxLength(500)]],
        });
        this.tutorsService.getTutorProfile(this.tutorId)
            .subscribe(success => {
                this.tutor = success;
                //this.incrementLoad();
                $('.loading').hide();
            }, error => {
                $('.loading').hide();
            });


        //this.tutorsService.getById(this.tutorId)
        //    .subscribe(success => {
        //        //this.tutor = success;
        //        this.incrementLoad();
        //    }, error => {
        //    });
         
        this.tutorSubjectsService.getByTutorForProfile(this.tutorId)
            .subscribe(success => {
                this.subjects = success;
                this.incrementLoad();
            }, error => {
            }); 
    }

    backToSearch(type) {
        if (type == 'back') {
            window.history.back();
            //window.location.href = '/tutor-course-search';
        } else {
            window.location.href = '/tutor/profile/edit';
        }
    }

    showMoreData() {
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    }
    redirectMe(typ, id) {
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id);
            localStorage.setItem('tid', this.tutorId);
            window.location.href = "/course-details";
        }
        if (typ == 'companyDetails') {
            window.location.href = "/company/"+id;
        }
    } 

    sendMessageForTutor() {
        this.contactTutorFormSubmitted = true;
        if (this.contactTutor.valid) {
            $('.loading').show();
            let userEmail = this.tutor.userEmail
            var sendMessageInfo = { ...this.contactTutor.getRawValue() };
            //this.contactTutor.controls["receiverEmail"].setValue(this.tutor.userEmail);
            this.contactTutor.patchValue({ 'receiverEmail': userEmail });
            sendMessageInfo.receiverEmail = userEmail;
            this.tutorsService.sendMessageToTutor(sendMessageInfo)
                .subscribe(success => {
                    if (success) {
                        debugger;
                        $('.loading').hide();
                        this.toastr.success('Mail sent sucessfully!');
                        window.location.reload();
                    } else {
                        $('.loading').hide();
                        this.toastr.error('Something went wrong');
                    }
                }, error => {
                    $('.loading').hide();
                    this.toastr.error('Something went wrong');
                });
        }
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
                //to check user is him self or checking others proifle
                var curl = window.location.href;
                var viewProfileId = curl.substring(curl.lastIndexOf('/') + 1);
                debugger;
                if (viewProfileId != this.alertMessage.id) {
                    this.isLoggedInUser = false;
                } 
                if (viewProfileId == 'view') {
                    this.isLoggedInUser = true;
                } 
            }, error => {
            });
    }
    
    markUpgradeProfileBasicTutorMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileUpgradeMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#profileUpgradeMessage').css('display', 'none');
            }, error => {
            });
    };

    goToTutorSearch() {
        window.location.href = "/tutor-search";
    }

    getTutorAvailability() {
        var curl = window.location.href;
        var tutorId = curl.substring(curl.lastIndexOf('/') + 1);
        debugger;
        $('.loading').show();
        this.companyService.getTutorAvailabilities(tutorId)
            .subscribe(success => {
                if (success != null) {
                    this.selectedTutorsData = success;
                    $('.loading').hide();
                }
            }, error => {
            });
    }

    setTab() {
        debugger;
        $('#mcur').css('display', 'none');
        this.profileTabActive = 'tab3';
        setTimeout(() => {
            this.calendarComponent.calendarApi.render();
            //$('tr.fc-scrollgrid-section-body').eq(0).hide();
            //this.calendarComponent.addLessonButton();
        }, 200)
    }

    setProfileTabActive(tabName) {
        this.profileTabActive = tabName;
    }
}
