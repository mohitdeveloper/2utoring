import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ClassSessionsService, TutorsService, UsersService, ClassSessionFeaturesService, CoursesService } from '../../../services';
import { LessonTimetableDay, LessonTimetableLesson, ClassSessionFeatures } from '../../../models';
import { error } from '@angular/compiler/src/util';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { isDate } from 'util';
import { data } from 'jquery';
import { CourseUploadDialogComponent } from '../../courses/course-upload-dialog/course-upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';

declare var title: any;
declare var isTutor: any;

@Component({
    selector: 'app-lesson-timetable',
    templateUrl: './lesson-timetable.component.html',
    styleUrls: ['./lesson-timetable.component.scss']
})
export class LessonTimetableComponent implements OnInit {
    constructor(private classSessionService: ClassSessionsService,
        private toastrService: ToastrService,
        private tutorsService: TutorsService,
        private usersService: UsersService,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private coursesService: CoursesService,
        private classSessionFeaturesService: ClassSessionFeaturesService) {
    }
    minutesBeforeEntry: number = 5;//for Student
    title: string = title;
    isTutor: boolean = isTutor;
    timeOffset: number;
    currentWeekOffset: number = 0;
    weekOffset: number = 0;
    lessonDays: LessonTimetableDay[] = null;
    today: number;
    selectedDay: number = 0;
    searchText: string = ''; // This searching is done on the front end as there is only ever a small number of results
    canStartTimeout: number = null;
    userLocalLogin: boolean = false;
    userHasGoogleAccountLinked: boolean = false;
    currentUrl: string = window.location.href;
    alertMessage: any = null;
    userType = 'Student';
    navigateFindALesson(): void {
        window.location.href = '/find-a-lesson';
    };

    navigateAddALesson(): void {
        window.location.href = '/Tutor/ClassSessions/Create';
    };

    selectDay(dayIndex: number): void {
        this.searchText = '';
        this.selectedDay = dayIndex;
    };

    noLessonsForSearch(searchText: string): boolean {
        var searchText = searchText.toLowerCase();
        for (var i = 0; i < this.lessonDays.length; i++) {
            for (var j = 0; j < this.lessonDays[i].lessons.length; j++) {
                if (this.lessonDays[i].lessons[j].name.toLowerCase().includes(searchText)) {
                    return false;
                }
            }
        }
        return true;
    }

    backWeek(): void {
        this.weekOffset--;
        this.getTimetable();
    };

    forwardWeek(): void {
        this.weekOffset++;
        this.getTimetable();
    };

    isToday(date: Date): boolean {
        return this.weekOffset == 0 && (new Date(date)).getUTCDay() == this.today;
    };

    getTimetable(): void {
        this.classSessionService.getTimetable(this.timeOffset, this.weekOffset)
            .subscribe(success => {
                this.currentWeekOffset = this.weekOffset; // Just so it doesn't look weird changing dates by a week
                this.lessonDays = success;
                let chooseDay: number = 0;
                // This logic finds a day by criteria of -> If there is a day, with lessons today or after, this will be chosen automatically
                // If a day with lessons isn't in this week the first day will be chosen, unless today is in this week in which case it is chosen
                // This is so the user requires the least clicks
                if (this.weekOffset == 0) {
                    for (let i = 0; i < this.lessonDays.length; i++) {
                        if (this.isToday(this.lessonDays[i].date)) {
                            chooseDay = i;
                            break;
                        }
                    }
                }
                for (let i = 0; i < this.lessonDays.length; i++) {
                    if (this.lessonDays[i].lessons.length > 0) {
                        if (chooseDay <= i) {
                            chooseDay = i;
                            break;
                        }
                    }
                }
                this.selectedDay = chooseDay;
                this.setupEntryTimeouts();
            },
                error => {
                    this.weekOffset = this.currentWeekOffset;
                    console.log(error);
                });
    };


    viewLesson(lesson: LessonTimetableLesson, dayIndex: number = -1, lessonIndex: number = -1) {

        
        $('.loading').show();
        let current = new Date().getTime();
        let endDate = new Date(lesson.endDate).getTime();
        if (current > endDate && dayIndex > -1 && lessonIndex > -1 && !lesson.complete) {
            this.classSessionService.cancelLesson(lesson.classSessionId)
                .subscribe(success => {
                    this.lessonDays[dayIndex].lessons[lessonIndex].complete = true;
                    this.allowViewLesson(lesson);
                }, error => { console.log(error) });
        }
        else {
            this.allowViewLesson(lesson);
        }

    }

    allowViewLesson(lesson: LessonTimetableLesson) {
        var _this = this;
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(lesson.classSessionId)
            .subscribe(features => {
                $('.loading').hide();
                if (_this.canOpenLesson(features, lesson)) {
                    setTimeout(function () { _this.openLesson(lesson); }, 500);
                } else {
                    this.toastrService.error(this.getOopsMsg(), "Not allowed", { timeOut: 5000 });
                }
            }, error => { console.log("Could not get classroom subscription features") });
    }

    // DONE Fix this to be as per feature switch
    enterLesson(lesson: LessonTimetableLesson, dayIndex: number = -1, lessonIndex: number = -1) {
        if (this.allowStartLesson(lesson.startDate) && dayIndex > -1 && lessonIndex > -1) {
            $('.loading').show();
            this.classSessionService.cancelLesson(lesson.classSessionId)
                .subscribe(success => {
                    $('.loading').hide();
                    this.lessonDays[dayIndex].lessons[lessonIndex].cancel = true;
                    this.toastrService.warning('Sorry! Lesson Timeout');
                    return;
                }, error => { console.log(error) });
        }
        else {
            var _this = this;
            this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(lesson.classSessionId)
                .subscribe(features => {
                    //console.log("Got classroom subscription features:", features);
                    console.log("Lesson:", lesson);
                    if (_this.canOpenLesson(features, lesson)) {
                        setTimeout(function () { _this.openLesson(lesson); }, 500);
                    } else {
                        this.toastrService.error(this.getOopsMsg(), "Not allowed", { timeOut: 5000 });
                    }
                }, error => { console.log("Could not get classroom subscription features") });
        }
    };

    getOopsMsg(): string {
        return this.isTutor ? 'Oops! Sorry, your subscription does not allow you to view completed lessons.' :
            'Sorry, this tutor currently does not allow you to view completed lessons.';
    }

    canOpenLesson(features: ClassSessionFeatures, lesson: LessonTimetableLesson): boolean {
        if (!features) return false;
        if (!lesson.complete && !lesson.ended) return true;

        let decision = (this.isTutor
            ? features.tutorDashboard_View_CompletedLesson
            : features.studentDashboard_View_CompletedLesson);

        return decision;
    }
    allowStartLesson(dt) {
        let today = new Date().getTime();
        let startDate = new Date(dt).getTime();
        let diffMs = (today - startDate); // milliseconds between now & startDate
        let diffMins = Math.round(diffMs / 60000); // minutes
        if (diffMins > 15)
            return true;
        return false;
    }
    openLesson(lesson: LessonTimetableLesson) {
        if (lesson.attendeeCount > 0) {
            if (lesson.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == false) {
                window.location.href = "/Account/LinkAccount?returnUrl=" + environment.classroomUrl + '/c/' + lesson.classSessionId;
            } else if (lesson.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == true) {
                window.location.href = "/Account/LoginAccount?returnUrl=" + environment.classroomUrl + '/c/' + lesson.classSessionId;
            } else {
                window.open(environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
            }
        } else {
            this.toastrService.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
        }
    }

    enterSetup(lesson: LessonTimetableLesson) {

        //window.location.href = '/Tutor/ClassSessions/Edit/' + lesson.classSessionId;
        //localStorage.setItem('courseId', lesson.courseId);
        //window.location.href = '/tutor/courses?courseId=' + lesson.courseId + '&lessonId=' + lesson.classSessionId;
        //window.location.href = 'tutor/courses/create-course';

        //this.coursesService.setData(lesson.courseId);
        //window.location.href = "/tutor/courses/create-course";

        if (!lesson.started || (lesson.started && lesson.ended)) {
            let dialogRef = this.dialog.open(CourseUploadDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '85%',
                //height: '90%',
                panelClass: 'myClass',
                autoFocus: false,
                data: {
                    classSessionId: lesson.classSessionId,
                    selectedTutorId: ''
                }
            });

        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }


    };

    // This function will cause the sessions to appear joinable if the correct time is met without refresh
    setupEntryTimeouts() {
        if (this.currentWeekOffset == 0) {
            for (var i = 0; i < this.lessonDays.length; i++) {
                if (this.isToday(this.lessonDays[i].date)) {
                    this.canStartTimeoutFunction(i, 0);
                    break;
                }
            }
        }
        else {
            if (this.canStartTimeout != null) {
                clearTimeout(this.canStartTimeout);
            }
        }
    };

    canStartTimeoutFunction(i, j): void {
        let minuteIncrement: number = this.isTutor == true ? this.minutesBeforeEntry : 5;
        let date: Date = new Date();
        debugger;
        console.log(this.minutesBeforeEntry)
        date.setMinutes(date.getMinutes() + minuteIncrement);
        for (; j < this.lessonDays[i].lessons.length; j++) {
            if (!this.lessonDays[i].lessons[j].canStart) {
                let timoutValue: number = (new Date(this.lessonDays[i].lessons[j].startDate)).getTime() - date.getTime();
                console.log(this.lessonDays[i]);
                if (timoutValue > 0) {
                    this.canStartTimeout = window.setTimeout(() => this.canStartTimeoutFunction(i, j), timoutValue, i, j);
                    break;
                }
                else {
                    this.lessonDays[i].lessons[j].canStart = true;

                }
            }

        }
    }

    ngOnInit() {

        let week = localStorage.getItem('week');
        if (week) {
            this.weekOffset = parseInt(week);
        };
        this.getUserAlertMessage();
        
        this.timeOffset = -1 * (new Date()).getTimezoneOffset(); // Gets the adustment in minutes required for the search i.e +01:00 -> -60
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        this.today = today.getUTCDay();
       

        if (this.isTutor == true) {
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.userLocalLogin = success.localLogin;
                    this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;

                    this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(success.tutorId)
                        .subscribe(features => {
                            debugger;
                            this.minutesBeforeEntry = features.classroom_ClassroomEntryTime_MinutesBeforeEntry;
                            this.getTimetable();
                        }, error => { console.log("Could not get classroom subscription features") });



                }, error => {
                });



        } else {
            this.usersService.getMy()
                .subscribe(success => {
                    this.userLocalLogin = success.localLogin;
                    this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
                    this.getTimetable();
                }, error => {
                });
        }
        
    };


    getOffset(sDate) {
        sDate = sDate.split('00')[1];
        return sDate;
    }

    checkEndDate(endDate, type = 'view') {

        let eDate = new Date(endDate);
        let currentDate = new Date();
        return type == 'view' ? eDate.getTime() < currentDate.getTime() : currentDate.getTime() < eDate.getTime();    //7, 14:29  //7, 14:30
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
                this.userType = this.alertMessage.userType;
            }, error => {
            });
    }
    backToday() {
        localStorage.removeItem('week');
        window.location.reload();
    }

    redirectPage(page) {
        if (page == 'createCourse') {
            this.coursesService.clearData();
            window.location.href = "/tutor/courses/create-course";
        }
        if (page == 'addSlots') {
            window.location.href = "/tutor/settings/calendar";
        }
        if (page == 'addSubject') {
            window.location.href = "/admin/"+this.alertMessage.id+"/tutor/prices";
        }
    }
}
