import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { CompanyService, SubjectsService, ClassSessionsService, StudyLevelsService, SubjectCategoriesService, CoursesService, TutorsService, SubjectStudyLevelSetupService, SessionInvitesService } from '../../../../services';
import { Company } from '../../../../models';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalenderComponent } from '../../../calender/calender.component';
import { CalenderSchedulerComponent } from '../../../calender-scheduler/calender-scheduler.component';
import { CourseUploadDialogComponent } from '../../../courses/course-upload-dialog/course-upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InviteStudentDialogComponent } from '../../../courses/invite-student-dialog/invite-student-dialog.component';
import { SubjectStudylevelCreateDialogComponent } from '../../../subject-studylevel-setup/subject-studylevel-create-dialog/subject-studylevel-create-dialog.component';
import { DatePipe } from '@angular/common';
import { GoogleLinkModal } from '../../../utilities/google-link-modal/google-link-modal';
import { SaveConfirmDialog } from '../../../courses/save-confirm/save-confirm-dialog.component';
import { Subscription } from 'rxjs';

declare var jQuery: any;
declare var stripeCountry: any;

@Component({
    selector: 'app-tutor-create-course',
    templateUrl: './tutor-create-course.component.html',
    styleUrls: ['./tutor-create-course.component.css']
})
export class TutorCreateCourseComponent implements OnInit {
    stripeCountry: any = stripeCountry;
    company: Company;
    subjectData: Array<any> = [];
    tutorsData: Array<any> = [];
    subjectCategories: Array<any> = [];
    StudyLevels: Array<any> = [];
    //selectedTutorsData: Array<any> = [];
    selectedTutorsData: any = [];
    tutorsGetFromSearch: {};
    getPriceObjectIds: {};
    classSessionsData: {};
    searchParams: {};
    selectedSubjectText: any;
    selectedSubjectId: any = '';
    selectedLevelText: any = '';
    selectedLevelId: any = '';
    selectedTutorId: any = '';
    selectedSubjectCategoryId: any = '';
    selectedClassSizeValue: number = 1;
    dbsApprovalStatus: string;
    profileApprovalStatus: string;
    isUnder18CheckForInvite: boolean;
    showAvailabilityPopup: boolean = false;
    formatLabel: any;
    started: boolean = false;
    completed: boolean = false;
    cancelled: boolean = false;
    published: boolean = true;
    emailObj: any;

    errorObj = [{ 'key': 4, 'value': 'Please select level!' }, { 'key': 5, 'value': 'Please click next to save calendar changes!' }, { 'key': 6, 'value': 'Please enter course details!' }, { 'key': 8, 'value': 'Please enter lesson details!' }];


    //companyId: any;
    pricePerPerson: number;
    tutorAvailable: boolean = false;
    gotTutors: boolean = false;

    hasGoogleAccountLinked: boolean = false;

    weekDaysList: string;
    courseTime: Date;
    searchCourseWeeks: number;
    timeTableLessionId: string = '';

    lessonTabs: string[] = ['Present & Future', 'Previous'];
    selectedlessonTabs = this.lessonTabs[0];

    incompleteStep: number = null;

    dayList: Array<any> = [];
    daysArray = [
        { day: "Monday", status: false },
        { day: "Tuesday", status: false },
        { day: "Wednesday", status: false },
        { day: "Thursday", status: false },
        { day: "Friday", status: false },
        { day: "Saturday", status: false },
        { day: "Sunday", status: false }
    ];

    selectedEvent = [];
    selectedDays = [];

    CompanyCourseForm: FormGroup;
    public classSessions: FormArray;
    CompanycompanyCourseFormSubmitted: boolean = false;
    get CompanyCourseFormCompanyControls() { return this.CompanyCourseForm.controls };

    // returns all form groups under contacts
    get contactFormGroup() {
        return this.classSessions.get('contacts') as FormArray;
    }

    isCourseFormVisible: boolean = false;
    editedCourse: any;
    maxRetry = 0;
    courseId: any = '';
    //@ViewChild('calendarRef', { static: false }) calendarRef: CalenderComponent;
    @ViewChild('calendarRef', { static: false }) calendarRef: CalenderSchedulerComponent;
    isUnder18Allowed: boolean = false;
    isOver18Allowed: boolean = true;
    allowedPrivateLesson: any = -1;
    allowedPublicLesson: any = -1;
    pricePerPersonEditAllowed: boolean = true;
    maxSizeOfClass = 0;
    userType: string;
    isUploadGreenBtn = {};
    sessionMediaCount = {};
    screenSize: number;
    scrHeight: any;
    scrWidth: any;

    //New variable
    currentStep: number = 1;
    editSlot: boolean = false;
    stepMove: number = 0;
    isFinished: string = "No";
    isUpdateAndFinished: boolean = false;
    isChangeDetected: boolean = false;
    isUpdated: boolean = false;
    subscription: Subscription;
    constructor(
        private subjectStudyLevelSetupService: SubjectStudyLevelSetupService,
        private tutorsService: TutorsService,
        public dialog: MatDialog,
        private coursesService: CoursesService,
        private companyService: CompanyService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private subjectService: SubjectsService,
        private ClassSessionsService: ClassSessionsService,
        private StudyLevelsService: StudyLevelsService,
        private SubjectCategoriesService: SubjectCategoriesService,
        private sessionInvitesService: SessionInvitesService,
        private cdref: ChangeDetectorRef
    ) {

    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.fc-today-button').addClass('col-12');
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
            $('#monthChangeButtons').css('display', 'block');
        } else {
            $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            //$('#monthChangeButtons').css('display', 'none');
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
                $('#monthChangeButtons').css('display', 'block');
            }, 300)
        } else {
            $('#myOtherLessonView').css('display', 'none');
            //$('#monthChangeButtons').css('display', 'none');
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
        $('.loading').show();
        this.getScreenSize();
        if (localStorage.getItem('origin')) {
            this.isUpdateAndFinished = true;
        }
        this.subjectStudyLevelSetupService.getUserType()
            .subscribe(success => {
                this.userType = success;
                if (this.userType == 'CompanyTutor') {
                    this.pricePerPersonEditAllowed = false;
                }
            }, error => {
            });
        this.selectedTutorId = null;///change by dynamic tutor id
        this.getAllSubject();
        this.getTutorAvailability(this.selectedTutorId);

        this.CompanyCourseForm = this.fb.group({
            isUnder18: [false, [Validators.required]],
            courseType: ['0', [Validators.required]],
            startDate: [],
            endDate: [],
            requiresGoogleAccount: [false],
            name: ['', [Validators.required, Validators.maxLength(60)]],
            description: ['', [Validators.maxLength(999)]],
            subjectId: ['', [Validators.required]],
            subjectCategoryId: ['9df87a2b-c750-4870-8fd7-0a9360429098'],
            studyLevelId: ['', [Validators.required]],
            maxClassSize: [1, [Validators.required]],
            pricePerPerson: [this.pricePerPerson, [Validators.required, Validators.min(5)]],
            //pricePerPerson: [15, [Validators.required, Validators.min(5)]],
            started: [false],
            completed: [false],
            cancelled: [false],
            published: [true],
            //companyId: [this.companyId],
            classSessions: this.fb.array([])

        });

        // set classSessions to this field
        this.classSessions = this.CompanyCourseForm.get('classSessions') as FormArray;
        //to set empyt  from arry initially
        ///this.classSessions.removeAt(0);

        if (localStorage.getItem('courseId')) {
            this.courseId = localStorage.getItem('courseId');
            this.onCourseEdit(this.courseId);
        } else {
            localStorage.clear();
        }

        this.currentStep = localStorage.getItem("currentStep") ? parseInt(localStorage.getItem("currentStep")) : 1;
        this.stepMove = localStorage.getItem("stepMove") ? parseInt(localStorage.getItem("stepMove")) : 0;
        this.isFinished = localStorage.getItem("isFinished") ? localStorage.getItem("isFinished") : "No";

        if (this.currentStep == 9) {
            $('body').css('background-image', "url('/')");
        }

        this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {

            //this.CompanyCourseForm.controls['maxClassSize'].setValue(res.tutorDashboard_CreateLesson_Session_MaxPersons);
            //this.isUnder18Allowed = res.tutorDashboard_CreateCourse_Under18;
            /*if(this.isUnder18Allowed){
                this.CompanyCourseForm.controls.isUnder18.disable(); 

            }*/
            //this.isUnder18Allowed = false;
            //this.maxSizeOfClass = 5;
            this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
            this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
            this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount
        }, err => {

        })

        let courseId = new URL(location.href).searchParams.get("courseId");
        this.timeTableLessionId = new URL(location.href).searchParams.get("lessonId");

        //if (courseId) {
        //    this.onCourseEdit(courseId);

        //}

    }

    ngAfterViewInit() {
        if (this.currentStep == 5) {
            this.calendarRef.addLessonButton();

        }
    }

    ngAfterViewChecked() {
        this.cdref.detectChanges();
    }

    // contact formgroup
    createContact(data, mode = 'created'): FormGroup {

        let classSize;
        let subjectCategoryId;
        let subjectId;
        let isUnder18
        let courseType;

        let defValues = {
            name: '',
            subjectCategoryId: null,
            requiresGoogleAccount: false,
            lessonDescriptionBody: '',
            classSessionId: null,
            baseTutorDirectoryId: null,
            sessionDirectoryName: null,
            sessionDirectoryId: null,
            baseStudentDirectoryId: null,
            sharedStudentDirectoryId: null,
            masterStudentDirectoryName: null,
            masterStudentDirectoryId: null,
        }
        if (data && mode == 'created') {
            var date = data._def.extendedProps.custom.date
            var time = data._def.title;
            defValues.name = 'Lesson-' + date + '(' + time + ')',
                classSize = parseInt(this.CompanyCourseForm.value.maxClassSize);
            //this.selectedSubjectCategoryId = this.CompanyCourseForm.value.subjectCategoryId;
            this.selectedSubjectId = this.CompanyCourseForm.value.subjectId;
            isUnder18 = this.CompanyCourseForm.value.isUnder18;
            courseType = this.CompanyCourseForm.value.courseType;
            this.selectedLevelId = this.CompanyCourseForm.value.studyLevelId;
            //this.getPricePerPerson(subjectId, this.selectedLevelId)

        }

        if (mode == 'edited') {
            let tmpStartDate = data.startDate.split("T");
            let tmpStartTime = tmpStartDate[1].split(":");
            let tmpEndTime = (data.endDate.split("T")[1]).split(":");
            date = tmpStartDate[0];
            time = tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1];
            defValues = {
                name: data.name,
                subjectCategoryId: data.subjectCategoryId,
                requiresGoogleAccount: data.requiresGoogleAccount ? data.requiresGoogleAccount : false,
                lessonDescriptionBody: data.lessonDescriptionBody,
                baseTutorDirectoryId: data.baseTutorDirectoryId,
                sessionDirectoryName: data.sessionDirectoryName,
                sessionDirectoryId: data.sessionDirectoryId,
                baseStudentDirectoryId: data.baseStudentDirectoryId,
                sharedStudentDirectoryId: data.sharedStudentDirectoryId,
                masterStudentDirectoryName: data.masterStudentDirectoryName,
                masterStudentDirectoryId: data.masterStudentDirectoryId,
                classSessionId: data.classSessionId,

            }
            this.pricePerPerson = data.pricePerPerson;
            classSize = this.editedCourse.maxClassSize;
            //this.selectedSubjectCategoryId = this.editedCourse.subjectCategoryId;
            this.selectedSubjectId = this.editedCourse.subjectId;
            isUnder18 = this.editedCourse.isUnder18;
            courseType = this.editedCourse.courseType;
            this.selectedLevelId = this.editedCourse.studyLevelId;

            this.selectedSubjectText = this.editedCourse.subjectName;
            this.selectedLevelText = this.editedCourse.studyLevelName;
        }

        return this.fb.group({
            name: [defValues.name, Validators.compose([Validators.required, Validators.maxLength(60)])],
            startDate: [date],
            endDate: [date],
            complete: [false],
            masterFilesCopied: [false],
            readMessagesTutor: [1],
            ended: [false],
            started: [false],
            chatActive: [false],
            hasEmailAttachment: [false],
            maxPersons: [classSize],
            pricePerPerson: [this.pricePerPerson, [Validators.required, Validators.min(5)]],
            studyLevelId: [this.selectedLevelId],
            subjectId: [this.selectedSubjectId],
            subjectCategoryId: [defValues.subjectCategoryId],
            isUnder16: [isUnder18 ? isUnder18 : false],
            type: [courseType ? courseType : 0],
            requiresGoogleAccount: [defValues.requiresGoogleAccount, Validators.compose([Validators.required])],
            lessonDescriptionBody: [defValues.lessonDescriptionBody, [Validators.maxLength(499)]],
            baseTutorDirectoryId: [defValues.baseTutorDirectoryId],
            sessionDirectoryName: [defValues.sessionDirectoryName],
            sessionDirectoryId: [defValues.sessionDirectoryId],
            baseStudentDirectoryId: [defValues.baseStudentDirectoryId],
            sharedStudentDirectoryId: [defValues.sharedStudentDirectoryId],
            masterStudentDirectoryName: [defValues.masterStudentDirectoryName],
            masterStudentDirectoryId: [defValues.masterStudentDirectoryId],


            leassonSubject: [this.selectedSubjectText],
            leassonLevel: [this.selectedLevelText],
            leassonTopic: [''],
            leassonTime: [time],
            classSessionId: [defValues.classSessionId]
        });
    }

    // add a contact form group
    addContact(data) {
        this.classSessions.push(this.createContact(data));
    }

    // remove contact from group
    removeContact(index) {
        this.classSessions.removeAt(index);
    }

    // get the formgroup under contacts form array
    getContactsFormGroup(index): FormGroup {
        const formGroup = this.classSessions.controls[index] as FormGroup;
        return formGroup;
    }

    setActive(day, status) {
        this.daysArray.forEach(object => {
            if (object.day == day.day) {
                if (day.status == true) {
                    day.status = false;
                } else {
                    day.status = true;
                }
            }
        });
    }

    //get all subjects list
    getAllSubject() {
        //this.subjectService.get()
        this.subjectService.getTutorCompanysubjects()
            .subscribe(success => {
                this.subjectData = success;
                $('.loading').hide();
            }, error => {
            });
    }

    //get all study levels
    //getStudyLevels() {
    //    //this.StudyLevelsService.get()
    //    this.StudyLevelsService.getTutorCompanyLevels()
    //        .subscribe(success => {
    //            this.StudyLevels = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}

    //get study levels on subject change
    getStudyLevels(id) {
        //this.StudyLevelsService.get()
        this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
            .subscribe(success => {
                this.StudyLevels = success;
                $('.loading').hide();
            }, error => {
            });
    }



    //get class sessions (level)
    getPaged() {

        this.coursesService.getPaged(1)
            .subscribe(success => {
                this.classSessionsData = success;
                $('.loading').hide();
            }, error => {
                this.classSessionsData = [];
            });
    }


    getEventsOnSidebar(eventObj, action = "add") {
        if (action == 'add') {
            let msg = ''
            if (this.CompanyCourseForm.controls['subjectId'].value == "") {
                this.currentStep = 3;
                msg = 'Please select Subject!';
                this.toastr.error(msg);
                return;
            } else if (this.CompanyCourseForm.controls['studyLevelId'].value == "") {
                this.currentStep = 4;
                msg = 'Please select Level!';
                this.toastr.error(msg);
                return;
            }

        }

        //let lessonType = this.CompanyCourseForm.controls['courseType'].value;
        //if (lessonType == 1 && this.allowedPrivateLesson == this.classSessions.length && action == 'add') {
        //    this.toastr.error('Over sequence limit for private lessons.');
        //    return;
        //}
        //if (lessonType == 0 && this.allowedPublicLesson == this.classSessions.length && action == 'add') {
        //    this.toastr.error('Over sequence limit for public lessons.');
        //    return;
        //}

        let event = action == 'add' ? eventObj.event : eventObj;
        if (event) {

            let tmpChk;
            tmpChk = this.selectedEvent.some((p, i) => {
                if (p.extendedProps.custom.date == event.extendedProps.custom.date &&
                    p.title == event.title) {
                    return true
                }
            });
            if (tmpChk) {
                if (action == 'add') {
                    this.toastr.warning('This event already selected!');
                }
                return;
            }

            if (action == 'add') {
                this.calendarRef.newChange = true;
                //this.incompleteStep = 5;
                // this.addContact(event);
                //var subjectId = this.CompanyCourseForm.value.subjectId;
                //var studyLevelId = this.CompanyCourseForm.value.studyLevelId;
                //set price per person
                //this.getPricePerPerson(subjectId, studyLevelId, event);
                this.addContact(event);
                event.typeOfEvent = 'add';
                this.isChangeDetected = true;
                console.log('set event on sidebar')
            };
            this.selectedEvent.push(event);

            //if (localStorage.getItem('courseId') && action == 'add') { 
            //    //this.incompleteStep = 5;
            //    //this.submitCompanyCourseForm(5);
            //}

            //if(action=='edit'){
            this.sortLessonForm(action);
            //}

        }
    }

    submitCompanyCourseForm(step) {
        debugger;
        if (this.incompleteStep != null) {
            this.showErrorMessages(this.incompleteStep);
            return;
        }

        //let d = new Date();
        //let n = d.getTimezoneOffset() * -1;
        //let offsetStr = Math.floor(n / 60) + ':' + n % 60;

        let d = new Date();
        let n = d.getTimezoneOffset() * -1;
        let c: any = Math.floor(n / 60);
        c = (c < 10 ? '0' : '') + c;
        //let offsetStr = c + ':' + n % 60;
        let ms: any = n % 60;
        ms = (ms < 10 ? '0' : '') + ms;
        let offsetStr = c + ':' + ms;

        //let lessonType = this.CompanyCourseForm.controls['courseType'].value;
        //if (lessonType == 1 && this.classSessions.length > this.allowedPrivateLesson ) {
        //    this.toastr.error('Over sequence limit for private lessons.');
        //    return;
        //}
        //if (lessonType == 0 && this.classSessions.length > this.allowedPublicLesson) {
        //    this.toastr.error('Over sequence limit for public lessons.');
        //    return;
        //}

        this.CompanyCourseForm.value.courseId;

        this.CompanycompanyCourseFormSubmitted = true;
        if (this.CompanyCourseForm.valid) {

            let obj = { ...this.CompanyCourseForm.getRawValue() };
            obj.creatorUserId = this.selectedTutorsData["userId"]
            if (this.courseId) {
                obj.courseId = this.courseId;
            }
            //obj.classSessions = obj.classSessions.map(c => {
            //    let tt = c.leassonTime.split("-");
            //    c.startDate = c.startDate + "T" + tt[0] + ":00+" + offsetStr;
            //    c.endDate = c.endDate + "T" + tt[1] + ":00+" + offsetStr;

            //    let d1: any = new Date(c.startDate);
            //    let d2: any = new Date(c.endDate);
            //    let diffMs = Math.abs(d2 - d1); // milliseconds between now & Christmas
            //    let diffMins = Math.floor((diffMs / 1000) / 60); // minutes
            //    
            //    c.detailsDuration = diffMins;

            //    return c;
            //})

            //lesson setup
            let subjectId = this.CompanyCourseForm.get('subjectId').value;
            let studyLevelId = this.CompanyCourseForm.get('studyLevelId').value;
            let isFolderExistsCount = 0;
            obj.classSessions = obj.classSessions.map(c => {
                let tt = c.leassonTime.split("-");
                c.startDate = c.startDate + "T" + tt[0] + ":00";
                c.endDate = c.endDate + "T" + tt[1] + ":00";
                let d1: any = new Date(c.startDate);
                let d2: any = new Date(c.endDate);
                let n = d1.getTimezoneOffset() * -1;
                let c1: any = Math.floor(n / 60);
                c1 = (c1 < 10 ? '0' : '') + c1;
                //let offsetStr = c + ':' + n % 60;
                let ms: any = n % 60;
                ms = (ms < 10 ? '0' : '') + ms;
                let offsetStr = '+' + c1 + ':' + ms;
                c.startDate = c.startDate + offsetStr;
                c.endDate = c.endDate + offsetStr;
                let diffMs = Math.abs(d2 - d1); // milliseconds between now & Christmas

                let diffMins = Math.floor((diffMs / 1000) / 60); // minutes

                c.detailsDuration = diffMins;
                c.requiresGoogleAccount = this.CompanyCourseForm.controls['requiresGoogleAccount'].value
                c.isUnder16 = this.CompanyCourseForm.controls['isUnder18'].value;
                c.ownerId = this.selectedTutorsData["userId"];
                c.subjectId = subjectId;
                c.studyLevelId = studyLevelId;
                if (!c.baseTutorDirectoryId) {
                    isFolderExistsCount++;
                }
                return c;
            })

            if (obj.classSessions.length > 0 && isFolderExistsCount > 0 && this.CompanyCourseForm.controls['requiresGoogleAccount'].value) {
                $('#drive-loding').show();
            }
            else {
                $('.loading').show();
            }
            if (obj.courseId) {
                this.unsubScribeChanges();
                this.isChangeDetected = false;
                this.isUpdated = true;
                this.companyService.updateCompanyCourse(obj)
                    .subscribe(success => {
                        debugger;
                        //if any of slots has been used by any other users
                        if (success.isClassSessionExist) {
                            this.classSessions.clear();
                            this.selectedEvent = [];
                            this.onCourseEdit(this.courseId);
                            this.setCurrentStep(5);
                            this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                            $('.loading').hide();
                            return;
                        }

                        this.CompanyCourseForm.reset();
                        (this.classSessions).clear();
                        this.setCourseForm(success);
                        this.editedCourse = success;
                        this.courseId = success.courseId;
                        success.classSessions.sort((a, b) => {
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                        });

                        success.classSessions.map((c, i) => {
                            this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                            this.classSessions.push(this.createContact(c, 'edited'));
                            let tmpStartDate = c.startDate.split("T");
                            let tmpStartTime = tmpStartDate[1].split(":");
                            let tmpEndTime = (c.endDate.split("T")[1]).split(":");
                            let ev = {
                                start: new Date(c.startDate),
                                title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                                extendedProps: {
                                    custom: {
                                        date: tmpStartDate[0]
                                    }
                                }
                            }
                            this.getEventsOnSidebar(ev, 'edit');
                        })
                        $('.loading').hide();
                        $('#drive-loding').hide();
                        debugger;
                        this.isUpdated = false;
                        if (step == 12) {
                            this.toastr.success('Course updated successfully!');
                            this.coursesService.clearData();
                            window.location.href = "/tutor/courses"
                        }


                        //this.onCourseEdit(obj.courseId);  
                        //location.reload();
                        //this.CompanyCourseForm.reset();
                        //(async () => {
                        //    await Promise.all(promises).then(resp => {
                        //        this.isChangeDetected = false;
                        //        this.preventChangeDetected = false;
                        //        $('.loading').hide();
                        //        $('#drive-loding').hide();

                        //    }).catch(err => {

                        //        $('.loading').hide();
                        //        $('#drive-loding').hide();
                        //    })


                        //})();

                    }, error => {
                        $('.loading').hide();
                        $('#drive-loding').hide();
                    });
            } else {
                this.companyService.saveCompanyCourse(obj)
                    .subscribe(success => {
                        //if any of slots has been used by any other users
                        if (success.isClassSessionExist) {
                            this.classSessions.clear();
                            this.selectedEvent = [];
                            this.setCurrentStep(5);
                            this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                            $('.loading').hide();
                            return;
                        }
                        (this.classSessions).clear();
                        this.editedCourse = success;
                        this.courseId = success.courseId;
                        localStorage.setItem('courseId', this.courseId);
                        let promises = success.classSessions.map((c, i) => {
                            this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                            this.classSessions.push(this.createContact(c, 'edited'));
                            let tmpStartDate = c.startDate.split("T");
                            let tmpStartTime = tmpStartDate[1].split(":");
                            let tmpEndTime = (c.endDate.split("T")[1]).split(":");
                            let ev = {
                                start: new Date(c.startDate),
                                title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                                extendedProps: {
                                    custom: {
                                        date: tmpStartDate[0]
                                    }
                                }
                            }
                            this.getEventsOnSidebar(ev, 'edit');
                            console.log("insert", i);
                        })
                        Promise.all(promises).then(resp => {
                            $('.loading').hide();
                            $('#drive-loding').hide();
                        }).catch(err => {
                            $('.loading').hide();
                            $('#drive-loding').hide();
                        })
                        //let courseId = success;
                        //this.onCourseEdit(courseId);
                        //this.CompanyCourseForm.reset();
                        if (step == 12) {
                            this.toastr.success('Course created successfully!');
                            this.coursesService.clearData();
                            window.location.href = "/tutor/courses"
                        }

                    }, error => {
                        $('.loading').hide();
                        $('#drive-loding').hide();
                    });
            }
        }
    }

    //lesson delete
    deletSelectedEvent(event, index, sortingType = 'yes') {
        if (!event) {
            event = this.selectedEvent[index];
        }
        $('.loading').show();
        let id = event.extendedProps.custom.date + "-" + event.title;
        let ev = this.calendarRef.calendarApi.getEventById(id);
        if (ev) {
            //this.isChangeDetected = true;
            let csp: any = ev.extendedProps.custom;
            let custom: any = {
                date: csp.date,
                fromTime: csp.fromTime,
                toTime: csp.toTime,
                type: csp.type,
                slotType: csp.slotType,
                titleClass: 'ava-slot'
            };
            if (ev.extendedProps.custom.type == 'weekEvent') {
                custom = {
                    date: csp.date,
                    fromTime: csp.fromTime,
                    toTime: csp.toTime,
                    type: 'weekEvent',
                    selectedWeekIndex: csp.selectedWeekIndex,
                    repeatedDays: csp.repeatedDays,
                    noOfWeek: csp.noOfWeek,
                    recurStart: csp.recurStart,
                    slotType: 0,
                    titleClass: 'ava-slot',
                    originDate: csp.originDate
                }
            }
            let event = {
                title: ev.title,
                start: ev.start,
                end: ev.end,
                allday: false,
                editable: false,
                custom: custom,
                id: ev.id
            };
            ev.remove();
            this.calendarRef.calendarApi.addEvent(event);
        }


        //let classSessioId = this.getContactsFormGroup(index).controls['classSessionId'];
        let classSessioId: any = this.getContactsFormGroup(index);
        if (classSessioId) {
            classSessioId = classSessioId.controls['classSessionId']
        }
        if (classSessioId && classSessioId.value) {
            this.coursesService.deleteLesson(classSessioId.value)
                .subscribe(success => {
                    $('.loading').hide();
                }, error => {
                    $('.loading').hide();
                });
            this.toastr.success('Event deleted successfully!');
        } else {
            $('.loading').hide();
            this.toastr.success('Event deleted successfully!');
        }

        this.removeContact(index);

        this.selectedEvent.splice(index, 1); //remove the mached object from the original array
        console.log(this.selectedEvent, index);
        if (this.selectedEvent.length == 0) {
            //this.incompleteStep = 5;
            this.calendarRef.newChange = true;

            this.setCurrentStep(5);
            setTimeout(() => {
                this.calendarRef.calendarApi.render();
            }, 200)
        }

        if (sortingType == 'yes') {
            this.sortLessonForm('delete');

        }
    }

    onSubjectChange($event) {

        if ($event) {
            this.isChangeDetected = true;
            console.log('subject change');
            //set incomplete step
            if (localStorage.getItem('courseId')) {
                this.incompleteStep = 4;
            } else {
                this.incompleteStep = null;
            }

            this.selectedSubjectText = $event.target.options[$event.target.options.selectedIndex].text;
            let id = $event.target.options[$event.target.options.selectedIndex].value;
            this.getSubjectCategory(id);


            if (id != this.selectedSubjectId) {
                this.CompanyCourseForm.patchValue({ "studyLevelId": "" });
                this.selectedSubjectId = id;
                this.getStudyLevels(id);
            }
        }
        else {
            this.selectedSubjectText = this.editedCourse.subjectName;
            this.getStudyLevels(this.editedCourse.subjectId);
            this.getSubjectCategory(this.selectedSubjectId);
        }
        //this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)

        //to get the price for leasson
        //let text, id;
        //if ($event) {
        //    text = $event.target.options[$event.target.options.selectedIndex].text;
        //    id = $event.target.options[$event.target.options.selectedIndex].value;
        //    this.selectedSubjectText = text;

        //} else {
        //    id = this.editedCourse.subjectId;
        //}

        //this.selectedSubjectText = text;
        // this.selectedSubjectId = id;
        //this.SubjectCategoriesService.getOptionsFiltered(id)
        //    .subscribe(success => {
        //        if (success != null) {
        //            this.selectedSubjectId = id;
        //            this.subjectCategories = success;

        //        }
        //    }, error => {
        //    });
        //this.currentStep = 4;
        //this.getStudyLevels(id)
    }


    onLevelChange(levelText, levelId) {
        //this.isChangeDetected = true;
        this.incompleteStep = null;
        this.selectedLevelId = levelId;
        this.selectedLevelText = levelText
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)
        //to get the price for leasson
        //let levelText = $event.target.options[$event.target.options.selectedIndex].text;
        //let levelId = $event.target.options[$event.target.options.selectedIndex].value;
        //this.selectedLevelText = levelText;
        //this.selectedLevelId = levelId;

    }
    onClassSizeChange($event) {
        //to get the price for leasson
        let text, id;
        if ($event) {
            //text = $event.target.options[$event.target.options.selectedIndex].text;
            //this.selectedClassSizeValue = $event.target.options[$event.target.options.selectedIndex].value;
            //this.selectedClassSizeValue = this.CompanyCourseForm.get('maxClassSize').value;
            this.selectedClassSizeValue = $event._value;
            this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)

            this.selectedClassSizeValue = $event.value;
            this.CompanyCourseForm.patchValue({ 'maxClassSize': this.selectedClassSizeValue });
            this.CompanyCourseForm.controls['maxClassSize'].markAsDirty();
            this.isChangeDetected = true;
        }
    }
    //get price per person
    //getPricePerPerson(subjectId, studyLevelId, event) {
    //    $('.loading').show();
    //    this.getPriceObjectIds = {
    //        //'CompanyId': this.companyId,
    //        'SubjectId': subjectId,
    //        'StudyLevelId': studyLevelId
    //    };
    //    this.companyService.getPricePerPerson(this.getPriceObjectIds)
    //        .subscribe(success => {
    //            this.pricePerPerson = success.pricePerPerson;
    //        }, err => {
    //        });

    //}

    // Get Subject Cagetory by Subject
    getSubjectCategory(id) {
        this.SubjectCategoriesService.getOptionsFiltered(id)
            .subscribe(success => {
                if (success != null) {
                    //this.selectedSubjectId = id;
                    this.subjectCategories = success;

                }
            }, error => {
            });
    }
    //get price per person
    getPricePerPerson(subjectId, studyLevelId, event) {
        $('.loading').show();
        this.getPriceObjectIds = {
            'SubjectId': subjectId,
            'StudyLevelId': studyLevelId
        };
        this.companyService.getPricePerPerson(this.getPriceObjectIds)
            .subscribe(success => {
                $('.loading').hide();
                if (this.CompanyCourseForm.value.maxClassSize > 1) {
                    this.pricePerPerson = success.groupPricePerPerson;
                } else {
                    this.pricePerPerson = success.pricePerPerson;
                }
                //this.pricePerPerson = success.pricePerPerson;
                this.CompanyCourseForm.controls["pricePerPerson"].setValue(this.pricePerPerson);
                this.addContact(event);
                this.sortLessonForm('edit');
            }, err => {
                $('.loading').hide();
                this.toastr.warning('Please select subject and level to get the price per person!');
                return false;
            });
    }
    //get price per person
    getPricePerPersonOnClassSizeChange(subjectId, studyLevelId, classSize) {
        if (this.selectedSubjectId && this.selectedLevelId) {
            $('.loading').show();
            this.getPriceObjectIds = {
                'SubjectId': subjectId,
                'StudyLevelId': studyLevelId
            };
            this.companyService.getPricePerPerson(this.getPriceObjectIds)
                .subscribe(success => {
                    $('.loading').hide();
                    if (classSize > 1) {
                        this.pricePerPerson = success.groupPricePerPerson;
                    } else {
                        this.pricePerPerson = success.pricePerPerson;
                    }
                    this.CompanyCourseForm.controls["pricePerPerson"].setValue(this.pricePerPerson);
                    this.classSessions.controls.map((ev) => {
                        ev.patchValue({ "pricePerPerson": this.pricePerPerson })

                    })
                }, err => {
                    $('.loading').hide();
                    //this.toastr.warning('Please select subject and level to get the price per person!');
                    //return false;
                });
        }
    }

    //onTutorSelection($event) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    let id = $event.target.options[$event.target.options.selectedIndex].value;
    //    this.selectedTutorId = id;
    //    this.companyService.getTutorAvailabilities(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.selectedTutorsData = success;
    //                $('.loading').hide();
    //            }
    //        }, error => {
    //        });
    //}

    //onTutorSelectionFromSearch(id) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    this.selectedTutorId = id;
    //    this.companyService.getTutorAvailabilities(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.selectedTutorsData = success;
    //                $('.loading').hide();
    //            }
    //        }, error => {
    //        });
    //}

    getTutorAvailability(id) {

        this.tutorAvailable = true;
        $('.loading').show();
        this.selectedTutorId = id;
        this.companyService.getTutorAvailabilities(id)
            .subscribe(success => {
                if (success != null) {
                    this.selectedTutorsData = success;
                    this.dbsApprovalStatus = this.selectedTutorsData['dbsApprovalStatus'];
                    if (this.dbsApprovalStatus == 'Approved') {
                        this.isUnder18Allowed = true;
                        //this.CompanyCourseForm.controls["isUnder18"].setValue(true);
                    } else {
                        this.isUnder18Allowed = false;
                        //this.CompanyCourseForm.controls["isUnder18"].setValue(false);
                    }
                    //set profileApprovalStatus
                    this.profileApprovalStatus = this.selectedTutorsData["profileApprovalStatus"];

                    this.hasGoogleAccountLinked = this.selectedTutorsData['hasGoogleAccountLinked'];
                    if (this.hasGoogleAccountLinked) {
                        //this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": true });
                        localStorage.removeItem('hasGoogleAccountLinked');
                    }
                    else {
                        //this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": false });
                        localStorage.removeItem('hasGoogleAccountLinked');
                    }

                    //$('.loading').hide();
                }
            }, error => {
            });
    }

    private selectedFile: File;
    onFileSelect(event) {
        this.selectedFile = event.target.files[0];

        console.log(this.selectedFile.name);
    }

    onKeyCourseTime(courseTime: Date) {
        this.courseTime = courseTime;
    }

    onKeyWeeks(courseWeeks: number) {
        this.searchCourseWeeks = courseWeeks;
    }

    searchTutors() {
        this.selectedDays = [];
        this.daysArray.forEach(object => {
            if (object.status == true) {
                this.selectedDays.push(object.day);
            }
        });
        this.searchParams = {
            'selectedDays': this.selectedDays.toString(),
            'courseTime': '0001-01-01T' + this.courseTime + 'Z',
            'weeks': this.searchCourseWeeks
        }

        if (this.selectedDays && this.courseTime && this.searchCourseWeeks) {
            $('.loading').show();
            this.companyService.getAvailableCompanyTutors(this.searchParams)
                .subscribe(success => {
                    if (success != null) {
                        $('.loading').hide();
                        this.gotTutors = true;
                        this.tutorsGetFromSearch = success;
                        $('.loading').hide();
                    }
                }, error => {
                });
        } else {
            this.toastr.warning('Please select days, time and weeks');
            return false;
        }
    }

    //showCourseForm() {
    //    if (Object.keys(this.selectedTutorsData).length == 0) {
    //        this.toastr.warning('Your profile or dbs status not approved');
    //        this.isCourseFormVisible = false;
    //        return false;
    //    }
    //    let profileApprovalStatus = this.selectedTutorsData["profileApprovalStatus"];
    //    let dbsApprovalStatus = this.selectedTutorsData["dbsApprovalStatus"]
    //    if ((profileApprovalStatus == "Pending" && dbsApprovalStatus == "Pending")
    //        || (profileApprovalStatus == "Pending" && dbsApprovalStatus == "Approved")
    //        || (profileApprovalStatus == "Pending" && dbsApprovalStatus == "NotRequired")) {
    //        this.toastr.warning('You are not allow to create a course');
    //        this.isCourseFormVisible = false;
    //        return false;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "Pending")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "Approved")) {
    //        //under-18=true and over-18=true
    //        this.isUnder18Allowed = true;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "NotRequired" && dbsApprovalStatus == "NotRequired")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "NotRequired")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }



    //    this.courseId = '';
    //    let tutorAvailabilities = this.selectedTutorsData['tutorAvailabilities'];
    //    this.selectedTutorsData['tutorAvailabilities'] = tutorAvailabilities;
    //    this.isCourseFormVisible = true;
    //    this.editedCourse = {};
    //    this.selectedEvent = [];
    //    (this.classSessions).clear();
    //    //this.CompanyCourseForm.reset();
    //    this.isUploadGreenBtn = {};

    //}

    setCourseForm(res) {
        debugger;
        let cType = {
            'Public': 1,
            'Private': 0
        }
        this.isCourseFormVisible = true;
        this.editedCourse = res;
        this.selectedEvent = [];
        this.pricePerPerson = res.pricePerPerson;
        this.CompanyCourseForm.patchValue({
            name: res.name,
            description: res.description,
            isUnder18: res.isUnder18,
            subjectId: res.subjectId,
            subjectCategoryId: res.subjectCategoryId,
            studyLevelId: res.studyLevelId,
            maxClassSize: res.maxClassSize,
            courseType: cType[res.courseType],
            requiresGoogleAccount: res.requiresGoogleAccount,
            pricePerPerson: res.pricePerPerson,
            started: false,
            completed: false,
            cancelled: false,
            published: true,
        });
        this.dbsApprovalStatus = res.dbsApprovalStatus;
        this.isUnder18CheckForInvite = res.isUnder18;


        this.selectedTutorId = res.tutorId;
        this.selectedClassSizeValue = res.maxClassSize
        this.selectedSubjectId = res.subjectId;
        this.selectedLevelId = res.studyLevelId;
        this.onSubjectChange('');
        this.subScribeChanges();
    }

    onCourseEdit(courseId) {
        $('.loading').show();
        (this.classSessions).clear();
        this.isUploadGreenBtn = {};
        this.courseId = courseId;

        this.coursesService.getEditedCourse(courseId).subscribe(res => {
            this.setCourseForm(res)
            //this.getSubjectCategory(this.selectedSubjectId); 
            if (res.classSessions.length == 0) {
                this.calendarRef.newChange = false;
                this.setCurrentStep(5);
                setTimeout(() => {
                    this.calendarRef.calendarApi.render();
                }, 200)
            }
            res.classSessions.sort((a, b) => {
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            });
            res.classSessions.map((c, i) => {
                this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                this.classSessions.push(this.createContact(c, 'edited'));
                let tmpStartDate = c.startDate.split("T");
                let tmpStartTime = tmpStartDate[1].split(":");
                let tmpEndTime = (c.endDate.split("T")[1]).split(":");
                let ev = {
                    start: new Date(c.startDate),
                    title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                    id: tmpStartDate[0] + '-' + tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                    extendedProps: {
                        custom: {
                            date: tmpStartDate[0]
                        }
                    }
                }
                this.getEventsOnSidebar(ev, 'edit');
            })

            //this.CompanyCourseForm.valueChanges.subscribe(() => {
            //    debugger;
            //    for (const field in this.CompanyCourseForm.controls) {
            //        if (this.CompanyCourseForm.controls[field].dirty && !this.isUpdated) {
            //            this.isChangeDetected = true;
            //            console.log('in value change');
            //        } 
            //    }  
            //});
            if (this.timeTableLessionId) {
                this.scrollTo(this.timeTableLessionId);
            }
            $('.loading').hide();
        }, err => {
            $('.loading').hide();
        })
    }



    getFileUploadWindow(classSessionId, index) {
        {

            let dialogRef = this.dialog.open(CourseUploadDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '85%',
                //width: '100%',
                panelClass: ["my-dialog", "myClass"],
                autoFocus: false,
                data: {
                    classSessionId: classSessionId,
                    selectedTutorId: this.selectedTutorId
                }
            });
            dialogRef.componentInstance.passData.subscribe(classSessionRef => {
                this.isUploadGreenBtn[index] = classSessionRef.sessionMedias.length > 0 ? true : false;
            })
        }
    }

    //to update and create folders on drive if hasgoogleaccount true and on checked
    googleDriverFolderCreation(classSessionId, status, index) {
        if (classSessionId) {
            $('.loading').show();
            var googleRequiredParam = {
                'classSessionId': classSessionId,
                'status': status
            }

            this.coursesService.checkAndCreateGoogleDriverFolders(googleRequiredParam)
                .subscribe(success => {
                    this.getContactsFormGroup(index).controls['baseTutorDirectoryId'].setValue(success.baseTutorDirectoryId);
                    this.getContactsFormGroup(index).controls['sessionDirectoryName'].setValue(success.sessionDirectoryName);
                    this.getContactsFormGroup(index).controls['sessionDirectoryId'].setValue(success.sessionDirectoryId);
                    this.getContactsFormGroup(index).controls['baseStudentDirectoryId'].setValue(success.baseStudentDirectoryId);
                    this.getContactsFormGroup(index).controls['sharedStudentDirectoryId'].setValue(success.sharedStudentDirectoryId);
                    this.getContactsFormGroup(index).controls['masterStudentDirectoryName'].setValue(success.masterStudentDirectoryName);
                    this.getContactsFormGroup(index).controls['masterStudentDirectoryId'].setValue(success.masterStudentDirectoryId);
                    $('.loading').hide();
                }, error => {
                    $('.loading').hide();
                });
        }
    }

    //get invite sutdents
    getInviteStudentsWindow($event) {

        if (!$event.target.checked) {
            return;
        }
        debugger;
        let allowAccess;
        if (this.editedCourse.companyId != null && this.editedCourse.companyStripeConnectAccountId != null && this.editedCourse.companyIDVerificationtStatus == "Approved") {
            allowAccess = true;
        } else if (this.editedCourse.stripeConnectAccountId && this.editedCourse.tutorIDVerificationtStatus == "Approved") {
            allowAccess = true;
        } else {
            allowAccess = false;
        }

        if ((this.editedCourse.started || this.editedCourse.published) && allowAccess && this.classSessions.controls.length > 0) {
            localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
            const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '90%',
                width: '55%',
                panelClass: ['myClass'],
                data: {
                    classSessionId: this.classSessions.controls[0].get('classSessionId').value,
                    selectedTutorId: this.selectedTutorId
                }
            });
            dialogRef.afterClosed().subscribe(() => {
                $event.target.checked = false;
                localStorage.removeItem('clasSize');
            });
        } else {
            this.toastr.error('Lesson start time has passed.');
            $event.target.checked = false;
            return false;
        }

        //if (this.classSessions.controls.length > 0) {
        //    localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
        //    const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
        //        maxWidth: '55vw',
        //        width: '100%',
        //        panelClass: ['myClass'],
        //        data: {
        //            classSessionId: this.classSessions.controls[0].get('classSessionId').value,
        //            selectedTutorId: this.selectedTutorId
        //        }
        //    });
        //    dialogRef.afterClosed().subscribe(() => {
        //        $event.target.checked = false;
        //        localStorage.removeItem('clasSize');
        //    });
        //}
    }

    counterMaxSize(i) {
        return new Array(i);
    }

    sortLessonForm(action) {


        this.selectedEvent.sort((a, b) => {
            return (a.start).getTime() - (b.start).getTime();
        });

        if (action == 'add' || action == 'delete') {
            this.arrangeSerialNumberOnEvent();
        }

        //let tempFormArr = this.classSessions.value;
        //tempFormArr.sort((a, b) => {
        //    let fDate = new Date(a.startDate + " "+ a.leassonTime.split('-')[0]);
        //    let sDate = new Date(b.startDate + " "+b.leassonTime.split('-')[0]);
        //    return fDate.getTime() - sDate.getTime();
        //});  
        //this.classSessions.patchValue(tempFormArr);
    }

    scrollTo(id: string): void {
        setTimeout(function () {
            const elementList = document.getElementById(id);
            const element = elementList as HTMLElement;
            element.scrollIntoView({ behavior: 'smooth' });
        }, 500);

    }
    finish() {
        window.location.href = "/tutor/courses";
    }

    //----------------------------------------------------------new implements----------------------------------------------------
    setCurrentStep(step, moveNext = 'Y', isSubmit = true) {

        var $container = $("html,body");
        var $scrollTo = $('#scroolHere');
        //$container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 300); 
        $container.animate({ scrollTop: $scrollTo.offset().top - 10, scrollLeft: 0 }, 300); 

        //if (this.scrWidth >= 768) {
        //    window.scrollTo(0, 0);
        //    window.scrollTo(0, 0);
        //}

        $('body').css('background-image', "url('/images/oval-left.svg')");
        if (this.currentStep == 5 && step != 5 && this.selectedEvent.length == 0) {
            this.toastr.error("Please select at least one slot!");
            return;
        }
        if (this.incompleteStep != null) {
            step = this.incompleteStep;
            this.currentStep = step;
            this.showErrorMessages(this.incompleteStep);
            //this.incompleteStep == null;
            return;
        }

        if (this.calendarRef.newChange) {
            if (this.currentStep == 5 && !isSubmit) {
                this.toastr.error("Please save calendar data!");
                return;
            }
            debugger;
            this.saveAvailability();
            this.incompleteStep = null;
            if (this.CompanyCourseForm.get("name").value) {
                this.submitCompanyCourseForm(step);
            };
            //this.toastr.error("Please save calendar data!");
            //return;
        }


        if (step > this.currentStep && moveNext == 'N')
            return;

        switch (step) {
            case 4:
                {
                    if (!this.checkSubject()) {
                        return;
                    }
                    this.currentStep = step;
                    break;
                }
            case 5:
                {
                    this.getScreenSize();
                    if (!this.checkSubjectLevel()) {
                        return;
                    }
                    setTimeout(() => {
                        this.calendarRef.calendarApi.render();
                        this.calendarRef.addLessonButton();
                    }, 200)
                    this.currentStep = step;
                    break;
                }
            case 6:
                {
                    if (isSubmit) {
                        if (this.classSessions.controls.length == 0) {
                            this.toastr.error("Please select at least one slot!");
                            return;
                        }
                    }
                    this.currentStep = step;
                    break;
                }
            case 7:
                {
                    if (!this.checkCourseName()) {
                        return;
                    }

                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    this.currentStep = step;
                    break;
                }
            case 8:
                {

                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    this.currentStep = step;
                    break;
                }
            case 9:
                {
                    if (!this.checkLessonDetails()) {
                        return;
                    }
                    $('body').css('background-image', "url('/')");

                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    //if (this.classSessions.controls.length > 1 && this.profileApprovalStatus == 'Approved') {
                    //    this.currentStep = step;
                    //} else {
                    //    this.toastr.error("At least two class sessions and profile approval required!");
                    //    this.currentStep = 10;
                    //}
                    this.currentStep = step;
                    break;
                }
            case 11: {

                this.isFinished = "Yes";
                localStorage.setItem("isFinished", this.isFinished);
                this.currentStep = step;
                break;
            }
            case 12:
                {
                    if (isSubmit) {
                        debugger;
                        this.emailObj = JSON.parse(localStorage.getItem('inviteEmailArray'));
                        this.sendInviteEmail(this.emailObj);

                        this.submitCompanyCourseForm(step);
                        return;
                    }
                    break;
                }
            default:
                this.currentStep = step;
        }

        if (step - 1 > this.stepMove) {
            this.stepMove = step - 1
        }
        if (step != 12) {
            localStorage.setItem("currentStep", this.currentStep.toString());
            localStorage.setItem("stepMove", this.stepMove.toString());
        }

    }



    //popup for google link

    googleLink($event) {
        if ($event.target.checked) {
            if (!this.hasGoogleAccountLinked) {
                localStorage.setItem('hasGoogleAccountLinked', '1');
                const dialogRef = this.dialog.open(GoogleLinkModal, {
                    maxWidth: '50vw',
                    //width: '100%',
                    panelClass: ["myClass"],
                    hasBackdrop: false,
                    data: {
                        'id': ''
                    }
                });
                dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
                    if (showSnackBar) {
                        $event.target.checked = false;
                        this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": false });
                        localStorage.removeItem('hasGoogleAccountLinked');
                    }
                });
            }
        }
    }


    //send invite email at the time of create new course
    sendInviteEmail(sessionInvitesNew) {
        debugger;
        this.sessionInvitesService.createMultiple(sessionInvitesNew)
            .subscribe(
                success => {
                    //if (success != '') {
                    //    this.toastr.success('Invitation sent successfully!.');
                    //} else {
                    //    this.toastr.warning('No new invitation sent!');
                    //}
                    $('.loading').hide();
                },
                error => { });
    }

    //to open popup window add subject price
    addPriceForSubjects() {

        const dialogRef = this.dialog.open(SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {}
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                this.getAllSubject();
            }
        });
    }
    addPriceForLevels() {
        const dialogRef = this.dialog.open(SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {
                'subjectId': this.selectedSubjectId,
            }
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                this.getAllSubject();
                this.getStudyLevels(this.selectedSubjectId);
                //this.CompanyCourseForm.controls.subjectId.setValue(this.selectedSubjectId);
                this.CompanyCourseForm.controls["subjectId"].setValue(this.selectedSubjectId);
            }
        });
    }
    checkSubject() {
        let subjectId = this.CompanyCourseForm.get("subjectId").value;
        if (!subjectId) {
            this.toastr.error("Please select subject");
            return false
        }
        return true;
        //if (subjectId != this.selectedSubjectId) {
        //    this.CompanyCourseForm.patchValue({ "studyLevelId": "" });
        //    this.selectedSubjectId = subjectId;
        //    this.getStudyLevels(subjectId);
        //}
        //return true;
        //if (this.currentStep - 1 > this.stepMove) {
        //    this.stepMove = this.currentStep - 1
        //}

    }
    checkSubjectLevel() {
        let studyLevelId = this.CompanyCourseForm.get("studyLevelId").value;
        if (!studyLevelId) {
            this.toastr.error("Please select level");
            return false
        }
        this.selectedLevelId = studyLevelId;
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)
        return true;


    }

    checkCourseName() {
        let courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.toastr.error("Please enter course name!");
            return false;
        } else {
            return true;
        }
    }

    checkLessonDetails() {
        if (this.classSessions.valid) {
            return true;
        } else {
            this.toastr.error("Please enter lesson details!");
            return false;
        }
    }


    setCourseType($event) {
        this.isChangeDetected = true;
        console.log('set course');
        if ($event.target.checked) {
            //public =1
            this.CompanyCourseForm.patchValue({ "courseType": 1 });
            this.classSessions.controls.map((ev) => {
                ev.patchValue({ "type": 1 })
            })
        }
        else {
            //private =0
            this.CompanyCourseForm.patchValue({ "courseType": 0 });
            this.classSessions.controls.map((ev) => {
                ev.patchValue({ "type": 0 })
            })
        }

    }
    getStartDate() {
        if (this.classSessions.controls[0]) {
            let sDate = this.classSessions.controls[0].get('startDate').value;
            this.CompanyCourseForm.patchValue({ 'startDate': this.createCourseDate(new Date(sDate)) });
            sDate = sDate.split('-').reverse().join('/');
            return sDate;
        }
        else {
            return '';
        }
    }
    getEndDate() {
        if (this.classSessions.controls[this.classSessions.length - 1]) {
            let eDate = this.classSessions.controls[this.classSessions.length - 1].get('endDate').value;
            this.CompanyCourseForm.patchValue({ 'endDate': this.createCourseDate(new Date(eDate)) });
            eDate = eDate.split('-').reverse().join('/');

            return eDate;
        }
        else {
            return '';
        }
    }
    getTotleLessonPrice() {
        let totalPrice = 0;
        this.classSessions.controls.map((ev) => {
            totalPrice = totalPrice + ev.get("pricePerPerson").value;
        })
        return totalPrice;
    }
    createCourseDate(dt) {

        var tzo = -dt.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return dt.getFullYear() +
            '-' + pad(dt.getMonth() + 1) +
            '-' + pad(dt.getDate()) +
            'T' + pad(dt.getHours()) +
            ':' + pad(dt.getMinutes()) +
            ':' + pad(dt.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);

    }
    saveAvailability() {
        let obj = this.calendarRef.addedEvents;
        if (this.calendarRef.deletedEvents.length > 0) {
            Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
        }

        this.tutorsService.saveAvailability(obj).subscribe(success => {
            //$('.loading').hide();
            this.calendarRef.newChange = false;
        }, error => {
            //$('.loading').hide();
        });
    }

    checkCourseNameOnBlur() {
        let courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.incompleteStep = 6;
            return false;
        } else {
            this.incompleteStep = null;
            return true;
        }
    }

    checkLessonDetailsOnBlur() {

        if (this.classSessions.valid) {
            this.incompleteStep = null;
            return true;
        } else {
            this.incompleteStep = 8;
            return false;
        }
    }

    setAgeRange($event) {
        if ($event.target.checked) {
            this.CompanyCourseForm.controls["isUnder18"].setValue(true);
        } else {
            this.CompanyCourseForm.controls["isUnder18"].setValue(false);
        }
    }

    showErrorMessages(nonCompleteStep) {
        this.errorObj.map((item) => {
            if (item.key == nonCompleteStep) {
                this.toastr.error(item.value);
            };
        })
    }

    addMoreLessons(stepCount) {
        this.setCurrentStep(stepCount);
        setTimeout(() => {
            this.calendarRef.calendarApi.render();
        }, 200)
    }

    arrangeSerialNumberOnEvent() {

        if (localStorage.getItem('courseId') && !this.editedCourse) {
            setTimeout(() => {
                this.arrangeSerialNumberOnEvent();
            }, 1000)

        }
        this.selectedEvent.map((s, i) => {
            debugger;
            let id = s.extendedProps.custom.date + "-" + s.title;
            let ev = this.calendarRef.calendarApi.getEventById(id);
            let event = ev.extendedProps.custom.type == 'dateEvent' ? this.getSingleEvent(ev, i) : this.getPatternEvent(ev, i);
            console.log(s);
            if (ev) {
                ev.remove()
            }
            this.calendarRef.calendarApi.addEvent(event);
        });
        this.calendarRef.calendarApi.render();
    }

    getSingleEvent(ev, i) {
        let event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'dateEvent',
                slotType: 2,
                titleClass: 'ava-slot slot-active',
                serialNumber: i + 1
            },
            id: ev.id
        };
        return event;
    }

    getPatternEvent(ev, i) {
        let event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            id: ev.id,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'weekEvent',
                selectedWeekIndex: ev.extendedProps.custom.selectedWeekIndex,
                repeatedDays: ev.extendedProps.custom.repeatedDays,
                noOfWeek: ev.extendedProps.custom.noOfWeek,
                recurStart: ev.extendedProps.custom.recurStart,
                slotType: 0,
                titleClass: 'ava-slot slot-active',
                originDate: ev.extendedProps.custom,
                serialNumber: i + 1
            }
        };
        return event;
    }
    exitCourse() {
        if (!this.isChangeDetected) {
            window.location.href = "/tutor/courses"
            return;
        }
        const dialogRef = this.dialog.open(SaveConfirmDialog, {
            hasBackdrop: false,
            data: {}
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                this.submitCompanyCourseForm(12)
            }
            else {
                window.location.href = "/tutor/courses"
            }
        });
    }

    unsubScribeChanges() {

    }

    subScribeChanges() {
        this.subscription = this.CompanyCourseForm.valueChanges.subscribe(() => {
            for (const field in this.CompanyCourseForm.controls) {
                if (this.CompanyCourseForm.controls[field].dirty && !this.isUpdated) {
                    this.isChangeDetected = true;
                    console.log('in value change', this.CompanyCourseForm.controls[field].dirty, field);
                }
            }
        });
    }

    resetCalendar() {
        //debugger;
        let temp = [...this.selectedEvent];
        for (let i = temp.length - 1; i >= 0; i--) {
            let a = temp[i];
            console.log("Index", i);
            if (a.typeOfEvent == 'add') {
                this.deletSelectedEvent(a, i, 'no');
            }
        }
        this.sortLessonForm('delete');
    }

    

}



