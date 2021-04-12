import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService, SubjectsService, ClassSessionsService, StudyLevelsService, SubjectCategoriesService, CoursesService, UsersService } from '../../../services';
import { Company } from '../../../models';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalenderComponent } from '../../calender/calender.component';
//import { debug } from 'console';
//import { debuglog } from 'util';
import { Time } from '@angular/common';
import { CourseUploadDialogComponent } from '../../courses/course-upload-dialog/course-upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InviteStudentDialogComponent } from '../../courses/invite-student-dialog/invite-student-dialog.component';

@Component({
    selector: 'app-company-courses',
    templateUrl: './company-courses.component.html',
    styleUrls: ['./company-courses.component.css']
})
export class CompanyCoursesComponent implements OnInit {

    lessonTabs: string[] = ['Present & Future', 'Previous'];
    selectedlessonTabs = this.lessonTabs[0];
    isCourseAddButton: boolean = false;
    alertMessage: any = null;
    //company: Company;
    //subjectData: Array<any> = [];
    //tutorsData: Array<any> = [];
    //subjectCategories: Array<any> = [];
    //StudyLevels: Array<any> = [];
    //selectedTutorsData: Array<any> = [];
    //tutorsGetFromSearch: {};
    //getPriceObjectIds: {};
    //classSessionsData: {};
    //searchParams: {};
    //selectedSubjectText: any;
    //selectedSubjectId: any = '';
    //selectedLevelText: any = '';
    //selectedLevelId: any = '';
    //selectedTutorId: any = '';
    //selectedSubjectCategoryId: any = '';
    ////companyId: any;
    //pricePerPerson: number;
    //tutorAvailable: boolean = false;
    //gotTutors: boolean = false;
    //isCourseFormVisible: boolean = false;
    //tutorDropDown: boolean;
    //hasGoogleAccountLinked: boolean = false;
    //isCourseAddButton: boolean = false;
    //selectedClassSizeValue: number;
    //dbsApprovalStatus: string;
    //isUnder18CheckForInvite: boolean;
    //isUploadGreenBtn = {};
    //sessionMediaCount = {};

    //weekDaysList: string;
    //courseTime: Time;
    //searchCourseWeeks: Number;

    //lessonTabs: string[] = ['Present & Future', 'Previous'];
    //selectedlessonTabs = this.lessonTabs[0];

    //dayList: Array<any> = [];
    //daysArray = [
    //    { day: "Monday", status: false },
    //    { day: "Tuesday", status: false },
    //    { day: "Wednesday", status: false },
    //    { day: "Thursday", status: false },
    //    { day: "Friday", status: false },
    //    { day: "Saturday", status: false },
    //    { day: "Sunday", status: false }
    //];

    //selectedEvent = [];
    //selectedDays = [];

    //CompanyCourseForm: FormGroup;
    //public classSessions: FormArray;
    //CompanycompanyCourseFormSubmitted: boolean = false;
    //get CompanyCourseFormCompanyControls() { return this.CompanyCourseForm.controls };

    //// returns all form groups under contacts
    //get contactFormGroup() {
    //    return this.classSessions.get('contacts') as FormArray;
    //}

    //editedCourse: any;
    //courseId: any = '';
    //@ViewChild('calendarRef') calendarRef: CalenderComponent;
    //isUnder18Allowed: boolean = true;
    //allowedPrivateLesson: any = '';
    //allowedPublicLesson: any = '';

    maxSizeOfClass = 0;

    constructor(public dialog: MatDialog, private coursesService: CoursesService, private companyService: CompanyService, private toastr: ToastrService, private fb: FormBuilder, private subjectService: SubjectsService, private ClassSessionsService: ClassSessionsService, private StudyLevelsService: StudyLevelsService, private SubjectCategoriesService: SubjectCategoriesService, private usersService: UsersService) { }

    ngOnInit(): void {
        $('.loading').show();
    //    // this.pricePerPerson = 25.00;
    //    //current we are using company id statically once will get setup pk's code in our machine will make it dynamic.
    //    this.getAllSubject();

        this.getAllTutors();
        this.getUserAlertMessage();

    //    this.getStudyLevels();

    //    this.CompanyCourseForm = this.fb.group({
    //        isUnder18: ['', [Validators.required]],
    //        courseType: ['', [Validators.required]],
    //        name: ['', [Validators.required, Validators.maxLength(50)]],
    //        subjectId: ['', [Validators.required]],
    //        subjectCategoryId: ['', [Validators.required]],
    //        studyLevelId: ['', [Validators.required]],
    //        maxClassSize: ['', [Validators.required]],
    //        tutorId: [this.selectedTutorId],
    //        pricePerPerson: ['', [Validators.required, Validators.min(5)]],
    //        started: [false],
    //        completed: [false],
    //        cancelled: [false],
    //        published: [true],
    //        classSessions: this.fb.array([this.createContact('')])

    //    });

    //    // set classSessions to this field
    //    this.classSessions = this.CompanyCourseForm.get('classSessions') as FormArray;
    //    //to set empyt  from arry initially
    //    this.classSessions.removeAt(0);

        this.companyService.getSubScriptionFeature().subscribe(res => {
            $('.loading').hide();
            //debugger;
            //this.CompanyCourseForm.controls['maxClassSize'].setValue(res.tutorDashboard_CreateLesson_Session_MaxPersons);
            //this.isUnder18Allowed = res.tutorDashboard_CreateCourse_Under18;
            /*if(this.isUnder18Allowed){
                this.CompanyCourseForm.controls.isUnder18.disable(); 

            }*/
            //this.isUnder18Allowed = false;
            //this.maxSizeOfClass = 5;
            this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
            //this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
            //this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount
        }, err => {

        })
    }


    createCourse() {
        this.coursesService.clearData();
        window.location.href = "/admin/courses/manage-course";
    }
    //delete courses
    onCourseDelete(courseId) {
        $('.loading').show();
        //soft delete course from database
        this.coursesService.deleteCourse(courseId)
            .subscribe(success => {
                //this.getPaged();
                this.toastr.success('Course deleted successfully!');
                location.reload();
                $('.loading').hide();
            }, error => {
                $('.loading').hide();
            });
    }


    //// contact formgroup
    //createContact(data, mode = 'created'): FormGroup {
    //    let classSize;
    //    let subjectCategoryId;
    //    let subjectId;
    //    let isUnder18
    //    let courseType;

    //    let defValues = {
    //        name: null,
    //        requiresGoogleAccount: null,
    //        lessonDescriptionBody: null,
    //        classSessionId: null,
    //        baseTutorDirectoryId: null,
    //        sessionDirectoryName: null,
    //        sessionDirectoryId: null,
    //        baseStudentDirectoryId: null,
    //        sharedStudentDirectoryId: null,
    //        masterStudentDirectoryName: null,
    //        masterStudentDirectoryId: null,
    //    }
    //    if (data && mode == 'created') {
    //        var date = data._def.extendedProps.custom.date
    //        var time = data._def.title;
    //        classSize = parseInt(this.CompanyCourseForm.value.maxClassSize);
    //        this.selectedSubjectCategoryId = this.CompanyCourseForm.value.subjectCategoryId;
    //        this.selectedSubjectId = this.CompanyCourseForm.value.subjectId;
    //        isUnder18 = this.CompanyCourseForm.value.isUnder18;
    //        courseType = this.CompanyCourseForm.value.courseType;
    //        this.selectedLevelId = this.CompanyCourseForm.value.studyLevelId;
    //        //this.getPricePerPerson(subjectId, this.selectedLevelId, '')

    //    }

    //    if (mode == 'edited') {
    //        let tmpStartDate = data.startDate.split("T");
    //        let tmpStartTime = tmpStartDate[1].split(":");
    //        let tmpEndTime = (data.endDate.split("T")[1]).split(":");
    //        date = tmpStartDate[0];
    //        time = tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1];
    //        defValues = {
    //            name: data.name,
    //            requiresGoogleAccount: data.requiresGoogleAccount ? data.requiresGoogleAccount : false,
    //            lessonDescriptionBody: data.lessonDescriptionBody,
    //            baseTutorDirectoryId: data.baseTutorDirectoryId, 
    //            sessionDirectoryName: data.sessionDirectoryName,
    //            sessionDirectoryId: data.sessionDirectoryId,
    //            baseStudentDirectoryId: data.baseStudentDirectoryId,
    //            sharedStudentDirectoryId: data.sharedStudentDirectoryId,
    //            masterStudentDirectoryName: data.masterStudentDirectoryName,
    //            masterStudentDirectoryId: data.masterStudentDirectoryId,
    //            classSessionId: data.classSessionId
    //        }
    //        this.pricePerPerson = data.pricePerPerson;
    //        classSize = this.editedCourse.maxClassSize;
    //        this.selectedSubjectCategoryId = this.editedCourse.subjectCategoryId;
    //        this.selectedSubjectId = this.editedCourse.subjectId;
    //        isUnder18 = this.editedCourse.isUnder18;
    //        courseType = this.editedCourse.courseType;
    //        this.selectedLevelId = this.editedCourse.studyLevelId;
    //        this.selectedSubjectText = this.editedCourse.subjectName;
    //        this.selectedLevelText = this.editedCourse.studyLevelName;
    //    }

    //    return this.fb.group({
    //        name: [defValues.name, Validators.compose([Validators.required])],
    //        startDate: [date],
    //        endDate: [date],
    //        complete: [false],
    //        masterFilesCopied: [false],
    //        readMessagesTutor: [1],
    //        ended: [false],
    //        started: [false],
    //        chatActive: [false],
    //        hasEmailAttachment: [false],
    //        maxPersons: [classSize],
    //        pricePerPerson: [this.pricePerPerson, [Validators.required, Validators.min(5)]],
    //        studyLevelId: [this.selectedLevelId],
    //        subjectId: [this.selectedSubjectId],
    //        subjectCategoryId: [this.selectedSubjectCategoryId],
    //        isUnder16: [isUnder18 ? isUnder18 : false],
    //        type: [courseType ? courseType : 0],
    //        requiresGoogleAccount: [defValues.requiresGoogleAccount, Validators.compose([Validators.required])],
    //        lessonDescriptionBody: [defValues.lessonDescriptionBody, Validators.compose([Validators.required])],
    //        baseTutorDirectoryId: [defValues.baseTutorDirectoryId],
    //        sessionDirectoryName: [defValues.sessionDirectoryName],
    //        sessionDirectoryId: [defValues.sessionDirectoryId],
    //        baseStudentDirectoryId: [defValues.baseStudentDirectoryId],
    //        sharedStudentDirectoryId: [defValues.sharedStudentDirectoryId],
    //        masterStudentDirectoryName: [defValues.masterStudentDirectoryName],
    //        masterStudentDirectoryId: [defValues.masterStudentDirectoryId],

    //        leassonSubject: [this.selectedSubjectText],
    //        leassonLevel: [this.selectedLevelText],
    //        leassonTopic: [''],
    //        leassonTime: [time],
    //        classSessionId: [defValues.classSessionId]
    //    });
    //}

    //// add a contact form group
    //addContact(data) {
    //    this.classSessions.push(this.createContact(data));
    //}

    //// remove contact from group
    //removeContact(index) {
    //    this.classSessions.removeAt(index);
    //}

    //// get the formgroup under contacts form array
    //getContactsFormGroup(index): FormGroup {
    //    const formGroup = this.classSessions.controls[index] as FormGroup;
    //    return formGroup;
    //}

    //setActive(day, status) {
    //    this.daysArray.forEach(object => {
    //        if (object.day == day.day) {
    //            if (day.status == true) {
    //                day.status = false;
    //            } else {
    //                day.status = true;
    //            }
    //        }
    //    });
    //}

    ////get all subjects list
    //getAllSubject() {
    //    //this.subjectService.get()
    //    this.subjectService.getTutorCompanysubjects()
    //        .subscribe(success => {
    //            this.subjectData = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}

    ////get study levels on subject change
    //getStudyLevels(id) {
    //    //this.StudyLevelsService.get()
    //    this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
    //        .subscribe(success => {
    //            this.StudyLevels = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}

    ////get all tutors list
    getAllTutors() {
        this.companyService.getTutorByCompany()
            .subscribe(success => {
                //this.tutorsData = success;
                if (success.length > 0) {
                    this.isCourseAddButton = true;
                } else {
                    this.toastr.warning('Courses can only be added once tutors have been registered. Please invite your tutors to register from the tutor option in the menu bar!');
                }
                $('.loading').hide();
            }, error => {
            });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }

    ////get class sessions (level)
    //getPaged() {
    //    this.coursesService.getPaged(1)
    //        .subscribe(success => {
    //            this.classSessionsData = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}


    //getEventsOnSidebar(eventObj, action = "add") {
    //    //debugger;
    //    if (action == 'add' &&
    //        (this.CompanyCourseForm.controls['subjectId'].value == ""
    //            || this.CompanyCourseForm.controls['studyLevelId'].value == ""
    //        )
    //    ) {
    //        this.toastr.error('Please select Subject and Level to get tutors!');
    //        return;
    //    }

    //    let lessonType = this.CompanyCourseForm.controls['courseType'].value;
    //    if (lessonType == 1 && this.allowedPrivateLesson == this.classSessions.length && action == 'add') {
    //        this.toastr.error('Over sequence limit for private lessons.');
    //        return;
    //    }
    //    if (lessonType == 0 && this.allowedPublicLesson == this.classSessions.length && action == 'add') {
    //        this.toastr.error('Over sequence limit for public lessons.');
    //        return;
    //    }

    //    let event = action == 'add' ? eventObj.event : eventObj;
    //    if (event) {

    //        let tmpChk;
    //        tmpChk = this.selectedEvent.some((p, i) => {
    //            if (p.extendedProps.custom.date == event.extendedProps.custom.date &&
    //                p.title == event.title) {
    //                return true
    //            }
    //        });
    //        if (tmpChk) {
    //            this.toastr.warning('This event already selected!');
    //            return;
    //        }

    //        if (action == 'add') {
    //            let id = event.extendedProps.custom.date + "-" + event.title;
    //            let ev = this.calendarRef.calendarApi.getEventById(id);
    //            if (ev) {
    //                let event = {
    //                    title: ev.title,
    //                    start: ev.start,
    //                    end: ev.end,
    //                    allday: false,
    //                    editable: false,
    //                    custom: {
    //                        date: ev.extendedProps.custom.date,
    //                        fromTime: ev.extendedProps.custom.fromTime,
    //                        toTime: ev.extendedProps.custom.toTime,
    //                        type: ev.extendedProps.custom.type,
    //                        titleClass: 'fc-daygrid-event-dot-blue'
    //                    },
    //                    id: ev.id
    //                };
    //                ev.remove();
    //                this.calendarRef.calendarApi.addEvent(event);
    //            }
    //            var subjectId = this.CompanyCourseForm.value.subjectId;
    //            var studyLevelId = this.CompanyCourseForm.value.studyLevelId;
    //            //set price per person
    //            this.getPricePerPerson(subjectId, studyLevelId, event);

    //        };
    //        this.selectedEvent.push(event);
    //        if(action=='edit'){
    //            this.sortLessonForm();
    //        }

    //    }
    //}

    //submitCompanyCourseForm() {
    //    //debugger;

    //    if (this.selectedTutorId == '') {
    //        this.toastr.error('Tutor required to create course!');
    //        return false;
    //    }

    //    //let d = new Date();
        

    //    let lessonType = this.CompanyCourseForm.controls['courseType'].value;
    //    if (lessonType == 1 && this.classSessions.length > this.allowedPrivateLesson) {
    //        this.toastr.error('Over sequence limit for private lessons.');
    //        return;
    //    }
    //    if (lessonType == 0 && this.classSessions.length > this.allowedPublicLesson) {
    //        this.toastr.error('Over sequence limit for public lessons.');
    //        return;
    //    }
        
    //    this.CompanyCourseForm.value.courseId;
    //    this.CompanycompanyCourseFormSubmitted = true;
    //    if (this.CompanyCourseForm.valid) {
    //        let obj = { ...this.CompanyCourseForm.getRawValue() };
    //        if (this.courseId) {
    //            obj.courseId = this.courseId;
    //        }
    //        obj.classSessions = obj.classSessions.map(c => {
    //            let tt = c.leassonTime.split("-");
    //            c.startDate = c.startDate + "T" + tt[0] + ":00";
    //            c.endDate = c.endDate + "T" + tt[1] + ":00";
    //            debugger;
    //            let d1: any = new Date(c.startDate);
    //            let d2: any = new Date(c.endDate);
    //            let n = d1.getTimezoneOffset() * -1;
    //            let c1: any = Math.floor(n / 60);
    //            c1 = (c1 < 10 ? '0' : '') + c1;
    //            //let offsetStr = c + ':' + n % 60;
    //            let ms: any = n % 60;
    //            ms = (ms < 10 ? '0' : '') + ms;
    //            let offsetStr ='+'+c1 + ':' + ms;
    //            c.startDate = c.startDate + offsetStr;
    //            c.endDate = c.endDate + offsetStr;
    //            let diffMs = Math.abs(d2 - d1); // milliseconds between now & Christmas

    //            let diffMins = Math.floor((diffMs / 1000) / 60); // minutes
    //            //debugger;
    //            c.detailsDuration = diffMins;
    //            c.isUnder16 = this.CompanyCourseForm.controls['isUnder18'].value;

    //            return c;
    //        })
    //        $('.loading').show();
    //        if (obj.courseId) {
    //            this.companyService.updateCompanyCourse(obj)
    //                .subscribe(success => {
    //                    this.toastr.success('Course updated successfully!');
    //                    $('.loading').hide();
    //                    this.onCourseEdit(obj.courseId);
    //                    //location.reload();
    //                    //this.CompanyCourseForm.reset();
    //                }, error => {
    //                    $('.loading').hide();
    //                });
    //        } else {
    //            this.companyService.saveCompanyCourse(obj)
    //                .subscribe(success => {
    //                    this.toastr.success('Course created successfully!');
    //                    $('.loading').hide();
    //                    let courseId = success;
    //                    this.onCourseEdit(courseId);
    //                    //this.CompanyCourseForm.reset();
    //                }, error => {
    //                    $('.loading').hide();
    //                });
    //        }
    //    }
    //}

    //deletSelectedEvent(event, index) {

    //    if (event) {
    //        $('.loading').show();
    //        let id = event.extendedProps.custom.date + "-" + event.title;
    //        let ev = this.calendarRef.calendarApi.getEventById(id);
    //        if (ev) {
    //            let event = {
    //                title: ev.title,
    //                start: ev.start,
    //                end: ev.end,
    //                allday: false,
    //                editable: false,
    //                custom: {
    //                    date: ev.extendedProps.custom.date,
    //                    fromTime: ev.extendedProps.custom.fromTime,
    //                    toTime: ev.extendedProps.custom.toTime,
    //                    type: ev.extendedProps.custom.type,
    //                },
    //                id: ev.id
    //            };
    //            ev.remove();
    //            this.calendarRef.calendarApi.addEvent(event);
    //        }

    //        this.selectedEvent.filter((p, i) => {
    //            if (p.extendedProps.custom.date == event.extendedProps.custom.date &&
    //                p.title == event.title) {
    //                this.selectedEvent.splice(i, 1);
    //                //remove the mached object from the original array
    //                let classSessioId = this.getContactsFormGroup(index).controls['classSessionId'];
    //                if (classSessioId.value) {
    //                    this.coursesService.deleteLesson(classSessioId.value)
    //                        .subscribe(success => {
    //                            $('.loading').hide();
    //                            //location.reload();
    //                            //this.CompanyCourseForm.reset();
    //                        }, error => {
    //                            $('.loading').hide();
    //                        });
    //                    this.toastr.success('Event deleted successfully!');
    //                } else {
    //                    $('.loading').hide();
    //                    this.toastr.success('Event deleted successfully!');
    //                }
    //            }
    //        });
    //        this.selectedEvent;
    //        this.removeContact(index)
    //    }
    //}

    //onSubjectChange($event) {
    //    //to get the price for leasson
    //    let text, id;
    //    if ($event) {
    //        text = $event.target.options[$event.target.options.selectedIndex].text;
    //        id = $event.target.options[$event.target.options.selectedIndex].value;
    //    } else {
    //        id = this.editedCourse.subjectId;
    //    }

    //    this.selectedSubjectText = text;
    //    this.selectedSubjectId = id;
    //    this.SubjectCategoriesService.getOptionsFiltered(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.subjectCategories = success;
    //            } 
    //        }, error => {
    //        });

    //    this.getStudyLevels(id)

    //    //get fitlered tutors accroding to selected subject and levels
    //    this.getFilteredTutors(id, this.selectedLevelId);
    //}

    //onLevelChange($event) {
    //    //to get the price for leasson
    //    let levelText = $event.target.options[$event.target.options.selectedIndex].text;
    //    let levelId = $event.target.options[$event.target.options.selectedIndex].value;
    //    this.selectedLevelText = levelText;
    //    this.selectedLevelId = levelId;

    //    //get fitlered tutors accroding to selected subject and levels
    //    this.getFilteredTutors(this.selectedSubjectId, levelId);
    //}

    ////get price per person
    //getPricePerPerson(subjectId, studyLevelId, event) {
    //    $('.loading').show();
    //    this.getPriceObjectIds = {
    //        'SubjectId': subjectId,
    //        'StudyLevelId': studyLevelId
    //    };
    //    this.companyService.getPricePerPerson(this.getPriceObjectIds)
    //        .subscribe(success => { 
    //            $('.loading').hide();
    //            if (this.CompanyCourseForm.value.maxClassSize > 1) {
    //                this.pricePerPerson = success.groupPricePerPerson;
    //            } else {
    //                this.pricePerPerson = success.pricePerPerson;
    //            }

    //            let abc: FormArray = this.classSessions;
    //            for (let c of abc.controls) {
    //                c.get('pricePerPerson').setValue(this.pricePerPerson);
    //            }

    //            this.CompanyCourseForm.controls["pricePerPerson"].setValue(this.pricePerPerson);
    //            this.addContact(event);
    //            this.sortLessonForm()
    //        }, err => {
    //            $('.loading').hide();
    //            this.toastr.warning('Please select subject and level to get the price per person!');
    //            return false;

    //        });

    //}

    //onTutorSelection($event) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    let id;
    //    if ($event) {
    //        id = $event.target.options[$event.target.options.selectedIndex].value;
    //        this.selectedTutorId = id;
    //    } else {
    //        id = this.selectedTutorId;
    //    }
    //    if (id != '') {
    //        this.companyService.getTutorAvailabilities(id)
    //            .subscribe(success => {
    //                if (success != null) {
    //                    this.selectedTutorsData = success;
    //                    this.hasGoogleAccountLinked = this.selectedTutorsData['hasGoogleAccountLinked'];
    //                    //this.hasGoogleAccountLinked = true;
    //                    $('.loading').hide();
    //                }
    //            }, error => {
    //            });
    //    } else {
    //        $('.loading').hide();
    //    }
    //}

    //onTutorSelectionFromSearch(id) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    // this.CompanyCourseForm.value.tutorId = id; 
    //    this.CompanyCourseForm.controls["tutorId"].setValue(id);
    //    this.companyService.getTutorAvailabilities(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.selectedTutorId = id;
    //                this.selectedTutorsData = success;
    //                this.hasGoogleAccountLinked = this.selectedTutorsData['hasGoogleAccountLinked'];
    //                $('.loading').hide();
    //            }
    //        }, error => {
    //        });
    //}

    //// private selectedFile: File;
    //// onFileSelect(event) {
    ////     this.selectedFile = event.target.files[0];

    ////     console.log(this.selectedFile.name);
    //// }

    //getFileUploadWindow(classSessionId,index) {
    //        const dialogRef = this.dialog.open(CourseUploadDialogComponent, {
    //            maxWidth: '80vw',
    //            height: '90%',
    //            panelClass: 'my-dialog',
    //            data: {
    //                classSessionId: classSessionId,
    //                selectedTutorId: this.selectedTutorId,
    //                selectedIndex: index
    //            },
    //        });
    //    dialogRef.componentInstance.passData.subscribe(classSessionRef => {
    //        this.isUploadGreenBtn[index] = classSessionRef.sessionMedias.length > 0 ? true : false;
    //    })
    //}

    //onKeyCourseTime(courseTime: Time) {
    //    this.courseTime = courseTime;
    //}

    //onKeyWeeks(courseWeeks: string) {
    //    this.searchCourseWeeks = parseInt(courseWeeks);
    //    //this.searchCourseWeeks = 1;
    //}

    //searchTutors() {
    //    this.selectedDays = [];
    //    this.daysArray.forEach(object => {
    //        if (object.status == true) {
    //            this.selectedDays.push(object.day);
    //        }
    //    });
    //    this.searchParams = {
    //        'selectedDays': this.selectedDays.toString(),
    //        'courseTime': '0001-01-01T' + this.courseTime + 'Z',
    //        'weeks': this.searchCourseWeeks ? this.searchCourseWeeks : 0
    //    }

    //    if (this.selectedDays && this.courseTime && this.searchCourseWeeks) {
    //        $('.loading').show();
    //        this.companyService.getAvailableCompanyTutors(this.searchParams)
    //            .subscribe(success => {
    //                if (success != null) {
    //                    $('.loading').hide();
    //                    this.gotTutors = true;
    //                    if (success == 0) {
    //                        this.toastr.error('Tutor required to create course!');
    //                    }
    //                    this.tutorsGetFromSearch = success;
    //                    $('.loading').hide();
    //                }
    //            }, error => {
    //            });
    //    } else {
    //        this.toastr.warning('Please select days, time and weeks');
    //        return false;
    //    }
    //}

    //showCourseForm() {
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

    //onCourseEdit(courseId) {
    //    $('.loading').show();
    //    this.tutorDropDown = true;
    //    (this.classSessions).clear();
    //    this.isUploadGreenBtn = {}
    //    this.courseId = courseId;
    //    let cType = {
    //        'Public': 0,
    //        'Private': 1
    //    }
    //    this.coursesService.getEditedCourse(courseId).subscribe(res => {
           
    //        this.isCourseFormVisible = true;
    //        this.tutorAvailable = true;
    //        this.editedCourse = res;
    //        this.selectedEvent = [];
    //        this.pricePerPerson = res.pricePerPerson;
    //        this.CompanyCourseForm.patchValue({
    //            name: res.name,
    //            isUnder18: res.isUnder18,
    //            subjectId: res.subjectId,
    //            subjectCategoryId: res.subjectCategoryId,
    //            studyLevelId: res.studyLevelId,
    //            maxClassSize: res.maxClassSize,
    //            courseType: cType[res.courseType],
    //            tutorId: res.tutorId,
    //            pricePerPerson: res.pricePerPerson,
    //            //leassonSubject: res.subjectName,
    //            //leassonLevel: res.studyLevelName,
    //        });
            
    //        this.dbsApprovalStatus = res.dbsApprovalStatus;
    //        this.isUnder18CheckForInvite = res.isUnder18;
    //        this.selectedTutorId = res.tutorId;
    //        this.onTutorSelection('');
    //        this.onSubjectChange('');
    //        res.classSessions.map((c, i) => {
    //            this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
    //            this.classSessions.push(this.createContact(c, 'edited'));
    //            let tmpStartDate = c.startDate.split("T");
    //            let tmpStartTime = tmpStartDate[1].split(":");
    //            let tmpEndTime = (c.endDate.split("T")[1]).split(":");
    //            let ev = {
    //                start: new Date(c.startDate),
    //                title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
    //                extendedProps: {
    //                    custom: {
    //                        date: tmpStartDate[0]
    //                    }
    //                }
    //            }
    //            this.getEventsOnSidebar(ev, 'edit');
    //            $('.loading').hide();
    //        })
    //    }, err => {
    //            $('.loading').hide();
    //    })
    //}

    ////delete courses
    //onCourseDelete(courseId) { 
    //    $('.loading').show();
    //    //soft delete course from database
    //    this.coursesService.deleteCourse(courseId)
    //        .subscribe(success => {
    //            //this.getPaged();
    //            this.toastr.success('Course deleted successfully!');
    //            location.reload();
    //            $('.loading').hide();
    //        }, error => {
    //            $('.loading').hide();
    //        });
    //}

   
    ////to update and create folders on drive if hasgoogleaccount true and on checked
    //googleDriverFolderCreation(classSessionId, status, index) {
    //    if (classSessionId) {
    //        $('.loading').show();
    //        var googleRequiredParam = {
    //            'classSessionId': classSessionId,
    //            'status': status
    //        }

    //        this.coursesService.checkAndCreateGoogleDriverFolders(googleRequiredParam)
    //            .subscribe(success => {
    //                this.getContactsFormGroup(index).controls['baseTutorDirectoryId'].setValue(success.baseTutorDirectoryId);
    //                this.getContactsFormGroup(index).controls['sessionDirectoryName'].setValue(success.sessionDirectoryName);
    //                this.getContactsFormGroup(index).controls['sessionDirectoryId'].setValue(success.sessionDirectoryId);
    //                this.getContactsFormGroup(index).controls['baseStudentDirectoryId'].setValue(success.baseStudentDirectoryId);
    //                this.getContactsFormGroup(index).controls['sharedStudentDirectoryId'].setValue(success.sharedStudentDirectoryId);
    //                this.getContactsFormGroup(index).controls['masterStudentDirectoryName'].setValue(success.masterStudentDirectoryName);
    //                this.getContactsFormGroup(index).controls['masterStudentDirectoryId'].setValue(success.masterStudentDirectoryId);
    //                $('.loading').hide();
    //            }, error => {
    //                $('.loading').hide();
    //            });
    //    }
    //}

    ////get invite sutdents
    //getInviteStudentsWindow(classSessionId) {
    //    const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
    //        maxWidth: '80vw',
    //        height: '90%',
    //        panelClass: 'my-dialog',
    //        data: {
    //            classSessionId: classSessionId,
    //            selectedTutorId: this.selectedTutorId
    //        }
    //    });
    //}

    //counterMaxSize(i) {
    //    return new Array(i);
    //}

    //sortLessonForm(){
    //    this.selectedEvent.sort((a, b) => {
    //        return (a.start).getTime() - (b.start).getTime();
    //    });
    //    let tempFormArr = this.classSessions.value;
    //    tempFormArr.sort((a, b) => {
    //        let fDate = new Date(a.startDate + " "+ a.leassonTime.split('-')[0]);
    //        let sDate = new Date(b.startDate + " "+b.leassonTime.split('-')[0]);
    //        return fDate.getTime() - sDate.getTime();
    //    });  
    //    this.classSessions.patchValue(tempFormArr);
    //}

    //getFilteredTutors(subJectId, subLevelId) {
    //    if (subJectId != '' && subLevelId != '') {
    //        let objForSubLevel = {
    //            'SubjectId': subJectId,
    //            'StudyLevelId': subLevelId
    //        }
    //        $('.loading').show();
    //        this.coursesService.getTutorsBysubjectLevelId(objForSubLevel)
    //            .subscribe(success => {
    //                this.tutorsData = success;
    //                $('.loading').hide();
    //            }, error => {
    //            });
    //    } 
    //}

    //onClassSizeChange($event) { 
    //    //to get the price for leasson
    //    let text, id;
    //    if ($event) {
    //        text = $event.target.options[$event.target.options.selectedIndex].text;
    //        //this.selectedClassSizeValue = $event.target.options[$event.target.options.selectedIndex].value;
    //        this.selectedClassSizeValue = this.CompanyCourseForm.get('maxClassSize').value;
    //        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)
    //    }
    //}


    ////get price per person
    //getPricePerPersonOnClassSizeChange(subjectId, studyLevelId, classSize) {
    //    $('.loading').show();
    //    this.getPriceObjectIds = {
    //        'SubjectId': subjectId,
    //        'StudyLevelId': studyLevelId
    //    };
    //    this.companyService.getPricePerPerson(this.getPriceObjectIds)
    //        .subscribe(success => {
    //            $('.loading').hide();
    //            if (classSize > 1) {
    //                this.pricePerPerson = success.groupPricePerPerson;
    //            } else {
    //                this.pricePerPerson = success.pricePerPerson;
    //            }

    //            let abc: FormArray = this.classSessions;
    //            for (let c of abc.controls) {
    //                c.get('pricePerPerson').setValue(this.pricePerPerson);
    //            }

    //            this.CompanyCourseForm.controls["pricePerPerson"].setValue(this.pricePerPerson);

    //        }, err => {
    //            $('.loading').hide();
    //            //this.toastr.warning('Please select subject and level to get the price per person!');
    //            //return false;
    //        });
    //}

    //finish() {
    //    window.location.reload();
    //}

}
