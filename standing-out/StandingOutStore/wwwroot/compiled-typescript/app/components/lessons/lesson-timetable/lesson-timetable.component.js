"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonTimetableComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var course_upload_dialog_component_1 = require("../../courses/course-upload-dialog/course-upload-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var LessonTimetableComponent = /** @class */ (function () {
    function LessonTimetableComponent(classSessionService, toastrService, tutorsService, usersService, dialog, toastr, coursesService, classSessionFeaturesService) {
        this.classSessionService = classSessionService;
        this.toastrService = toastrService;
        this.tutorsService = tutorsService;
        this.usersService = usersService;
        this.dialog = dialog;
        this.toastr = toastr;
        this.coursesService = coursesService;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.minutesBeforeEntry = 5; //for Student
        this.title = title;
        this.isTutor = isTutor;
        this.currentWeekOffset = 0;
        this.weekOffset = 0;
        this.lessonDays = null;
        this.selectedDay = 0;
        this.searchText = ''; // This searching is done on the front end as there is only ever a small number of results
        this.canStartTimeout = null;
        this.userLocalLogin = false;
        this.userHasGoogleAccountLinked = false;
        this.currentUrl = window.location.href;
        this.alertMessage = null;
        this.userType = 'Student';
    }
    LessonTimetableComponent.prototype.navigateFindALesson = function () {
        window.location.href = '/find-a-lesson';
    };
    ;
    LessonTimetableComponent.prototype.navigateAddALesson = function () {
        window.location.href = '/Tutor/ClassSessions/Create';
    };
    ;
    LessonTimetableComponent.prototype.selectDay = function (dayIndex) {
        this.searchText = '';
        this.selectedDay = dayIndex;
    };
    ;
    LessonTimetableComponent.prototype.noLessonsForSearch = function (searchText) {
        var searchText = searchText.toLowerCase();
        for (var i = 0; i < this.lessonDays.length; i++) {
            for (var j = 0; j < this.lessonDays[i].lessons.length; j++) {
                if (this.lessonDays[i].lessons[j].name.toLowerCase().includes(searchText)) {
                    return false;
                }
            }
        }
        return true;
    };
    LessonTimetableComponent.prototype.backWeek = function () {
        this.weekOffset--;
        this.getTimetable();
    };
    ;
    LessonTimetableComponent.prototype.forwardWeek = function () {
        this.weekOffset++;
        this.getTimetable();
    };
    ;
    LessonTimetableComponent.prototype.isToday = function (date) {
        return this.weekOffset == 0 && (new Date(date)).getUTCDay() == this.today;
    };
    ;
    LessonTimetableComponent.prototype.getTimetable = function () {
        var _this_1 = this;
        this.classSessionService.getTimetable(this.timeOffset, this.weekOffset)
            .subscribe(function (success) {
            _this_1.currentWeekOffset = _this_1.weekOffset; // Just so it doesn't look weird changing dates by a week
            _this_1.lessonDays = success;
            var chooseDay = 0;
            // This logic finds a day by criteria of -> If there is a day, with lessons today or after, this will be chosen automatically
            // If a day with lessons isn't in this week the first day will be chosen, unless today is in this week in which case it is chosen
            // This is so the user requires the least clicks
            if (_this_1.weekOffset == 0) {
                for (var i = 0; i < _this_1.lessonDays.length; i++) {
                    if (_this_1.isToday(_this_1.lessonDays[i].date)) {
                        chooseDay = i;
                        break;
                    }
                }
            }
            for (var i = 0; i < _this_1.lessonDays.length; i++) {
                if (_this_1.lessonDays[i].lessons.length > 0) {
                    if (chooseDay <= i) {
                        chooseDay = i;
                        break;
                    }
                }
            }
            _this_1.selectedDay = chooseDay;
            _this_1.setupEntryTimeouts();
        }, function (error) {
            _this_1.weekOffset = _this_1.currentWeekOffset;
            console.log(error);
        });
    };
    ;
    LessonTimetableComponent.prototype.viewLesson = function (lesson, dayIndex, lessonIndex) {
        var _this_1 = this;
        if (dayIndex === void 0) { dayIndex = -1; }
        if (lessonIndex === void 0) { lessonIndex = -1; }
        $('.loading').show();
        var current = new Date().getTime();
        var endDate = new Date(lesson.endDate).getTime();
        if (current > endDate && dayIndex > -1 && lessonIndex > -1 && !lesson.complete) {
            this.classSessionService.cancelLesson(lesson.classSessionId)
                .subscribe(function (success) {
                _this_1.lessonDays[dayIndex].lessons[lessonIndex].complete = true;
                _this_1.allowViewLesson(lesson);
            }, function (error) { console.log(error); });
        }
        else {
            this.allowViewLesson(lesson);
        }
    };
    LessonTimetableComponent.prototype.allowViewLesson = function (lesson) {
        var _this_1 = this;
        var _this = this;
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(lesson.classSessionId)
            .subscribe(function (features) {
            $('.loading').hide();
            if (_this.canOpenLesson(features, lesson)) {
                setTimeout(function () { _this.openLesson(lesson); }, 500);
            }
            else {
                _this_1.toastrService.error(_this_1.getOopsMsg(), "Not allowed", { timeOut: 5000 });
            }
        }, function (error) { console.log("Could not get classroom subscription features"); });
    };
    // DONE Fix this to be as per feature switch
    LessonTimetableComponent.prototype.enterLesson = function (lesson, dayIndex, lessonIndex) {
        var _this_1 = this;
        if (dayIndex === void 0) { dayIndex = -1; }
        if (lessonIndex === void 0) { lessonIndex = -1; }
        if (this.allowStartLesson(lesson.startDate) && dayIndex > -1 && lessonIndex > -1) {
            $('.loading').show();
            this.classSessionService.cancelLesson(lesson.classSessionId)
                .subscribe(function (success) {
                $('.loading').hide();
                _this_1.lessonDays[dayIndex].lessons[lessonIndex].cancel = true;
                _this_1.toastrService.warning('Sorry! Lesson Timeout');
                return;
            }, function (error) { console.log(error); });
        }
        else {
            var _this = this;
            this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(lesson.classSessionId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                console.log("Lesson:", lesson);
                if (_this.canOpenLesson(features, lesson)) {
                    setTimeout(function () { _this.openLesson(lesson); }, 500);
                }
                else {
                    _this_1.toastrService.error(_this_1.getOopsMsg(), "Not allowed", { timeOut: 5000 });
                }
            }, function (error) { console.log("Could not get classroom subscription features"); });
        }
    };
    ;
    LessonTimetableComponent.prototype.getOopsMsg = function () {
        return this.isTutor ? 'Oops! Sorry, your subscription does not allow you to view completed lessons.' :
            'Sorry, this tutor currently does not allow you to view completed lessons.';
    };
    LessonTimetableComponent.prototype.canOpenLesson = function (features, lesson) {
        if (!features)
            return false;
        if (!lesson.complete && !lesson.ended)
            return true;
        var decision = (this.isTutor
            ? features.tutorDashboard_View_CompletedLesson
            : features.studentDashboard_View_CompletedLesson);
        return decision;
    };
    LessonTimetableComponent.prototype.allowStartLesson = function (dt) {
        var today = new Date().getTime();
        var startDate = new Date(dt).getTime();
        var diffMs = (today - startDate); // milliseconds between now & startDate
        var diffMins = Math.round(diffMs / 60000); // minutes
        if (diffMins > 15)
            return true;
        return false;
    };
    LessonTimetableComponent.prototype.openLesson = function (lesson) {
        if (lesson.attendeeCount > 0) {
            if (lesson.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == false) {
                window.location.href = "/Account/LinkAccount?returnUrl=" + environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId;
            }
            else if (lesson.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == true) {
                window.location.href = "/Account/LoginAccount?returnUrl=" + environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId;
            }
            else {
                window.open(environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
            }
        }
        else {
            this.toastrService.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
        }
    };
    LessonTimetableComponent.prototype.enterSetup = function (lesson) {
        //window.location.href = '/Tutor/ClassSessions/Edit/' + lesson.classSessionId;
        //localStorage.setItem('courseId', lesson.courseId);
        //window.location.href = '/tutor/courses?courseId=' + lesson.courseId + '&lessonId=' + lesson.classSessionId;
        //window.location.href = 'tutor/courses/create-course';
        //this.coursesService.setData(lesson.courseId);
        //window.location.href = "/tutor/courses/create-course";
        if (!lesson.started || (lesson.started && lesson.ended)) {
            var dialogRef = this.dialog.open(course_upload_dialog_component_1.CourseUploadDialogComponent, {
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
    ;
    // This function will cause the sessions to appear joinable if the correct time is met without refresh
    LessonTimetableComponent.prototype.setupEntryTimeouts = function () {
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
    ;
    LessonTimetableComponent.prototype.canStartTimeoutFunction = function (i, j) {
        var _this_1 = this;
        var minuteIncrement = this.isTutor == true ? this.minutesBeforeEntry : 5;
        var date = new Date();
        debugger;
        console.log(this.minutesBeforeEntry);
        date.setMinutes(date.getMinutes() + minuteIncrement);
        for (; j < this.lessonDays[i].lessons.length; j++) {
            if (!this.lessonDays[i].lessons[j].canStart) {
                var timoutValue = (new Date(this.lessonDays[i].lessons[j].startDate)).getTime() - date.getTime();
                console.log(this.lessonDays[i]);
                if (timoutValue > 0) {
                    this.canStartTimeout = window.setTimeout(function () { return _this_1.canStartTimeoutFunction(i, j); }, timoutValue, i, j);
                    break;
                }
                else {
                    this.lessonDays[i].lessons[j].canStart = true;
                }
            }
        }
    };
    LessonTimetableComponent.prototype.ngOnInit = function () {
        var _this_1 = this;
        var week = localStorage.getItem('week');
        if (week) {
            this.weekOffset = parseInt(week);
        }
        ;
        this.getUserAlertMessage();
        this.timeOffset = -1 * (new Date()).getTimezoneOffset(); // Gets the adustment in minutes required for the search i.e +01:00 -> -60
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        this.today = today.getUTCDay();
        if (this.isTutor == true) {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this_1.userLocalLogin = success.localLogin;
                _this_1.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
                _this_1.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(success.tutorId)
                    .subscribe(function (features) {
                    debugger;
                    _this_1.minutesBeforeEntry = features.classroom_ClassroomEntryTime_MinutesBeforeEntry;
                    _this_1.getTimetable();
                }, function (error) { console.log("Could not get classroom subscription features"); });
            }, function (error) {
            });
        }
        else {
            this.usersService.getMy()
                .subscribe(function (success) {
                _this_1.userLocalLogin = success.localLogin;
                _this_1.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
                _this_1.getTimetable();
            }, function (error) {
            });
        }
    };
    ;
    LessonTimetableComponent.prototype.getOffset = function (sDate) {
        sDate = sDate.split('00')[1];
        return sDate;
    };
    LessonTimetableComponent.prototype.checkEndDate = function (endDate, type) {
        if (type === void 0) { type = 'view'; }
        var eDate = new Date(endDate);
        var currentDate = new Date();
        return type == 'view' ? eDate.getTime() < currentDate.getTime() : currentDate.getTime() < eDate.getTime(); //7, 14:29  //7, 14:30
    };
    LessonTimetableComponent.prototype.getUserAlertMessage = function () {
        var _this_1 = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this_1.alertMessage = success;
            _this_1.userType = _this_1.alertMessage.userType;
        }, function (error) {
        });
    };
    LessonTimetableComponent.prototype.backToday = function () {
        localStorage.removeItem('week');
        window.location.reload();
    };
    LessonTimetableComponent.prototype.redirectPage = function (page) {
        if (page == 'createCourse') {
            this.coursesService.clearData();
            window.location.href = "/tutor/courses/create-course";
        }
        if (page == 'addSlots') {
            window.location.href = "/tutor/settings/calendar";
        }
        if (page == 'addSubject') {
            window.location.href = "/admin/" + this.alertMessage.id + "/tutor/prices";
        }
    };
    LessonTimetableComponent = __decorate([
        core_1.Component({
            selector: 'app-lesson-timetable',
            templateUrl: './lesson-timetable.component.html',
            styleUrls: ['./lesson-timetable.component.scss']
        }),
        __metadata("design:paramtypes", [services_1.ClassSessionsService,
            ngx_toastr_1.ToastrService,
            services_1.TutorsService,
            services_1.UsersService,
            dialog_1.MatDialog,
            ngx_toastr_1.ToastrService,
            services_1.CoursesService,
            services_1.ClassSessionFeaturesService])
    ], LessonTimetableComponent);
    return LessonTimetableComponent;
}());
exports.LessonTimetableComponent = LessonTimetableComponent;
//# sourceMappingURL=lesson-timetable.component.js.map