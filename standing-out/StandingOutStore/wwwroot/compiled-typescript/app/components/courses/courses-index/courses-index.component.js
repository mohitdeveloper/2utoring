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
exports.CoursesIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var rxjs_1 = require("rxjs");
var course_class_sessions_dialog_component_1 = require("../course-class-sessions-dialog/course-class-sessions-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var invite_student_dialog_component_1 = require("../invite-student-dialog/invite-student-dialog.component");
var CoursesIndexComponent = /** @class */ (function () {
    function CoursesIndexComponent(dialog, tutorsService, coursesService, toastr, classSessionFeaturesService) {
        var _this = this;
        this.dialog = dialog;
        this.tutorsService = tutorsService;
        this.coursesService = coursesService;
        this.toastr = toastr;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.onCourseEdit = new core_1.EventEmitter();
        this.onCourseDelete = new core_1.EventEmitter();
        this.url = window.location.hostname;
        this.alertMessage = alertMessage;
        this.takeValues = [
            { take: 10, name: 'Show 10' },
            { take: 25, name: 'Show 25' },
            { take: 50, name: 'Show 50' },
            { take: 100, name: 'Show 100' }
        ];
        this.searchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'StartDate',
            order: 'DESC',
            filter: '',
        };
        this.results = { paged: null, data: null };
        this.classSessionFeatures = new index_1.ClassSessionFeatures();
        this.canViewCompletedLessons = false;
        this.canActionTaken = true;
        // usage getClassSessionFeaturesByTutorId.subscribe(features => { // do stuff with features });
        this.getSubscriptionFeaturesByClassSessionId = new rxjs_1.Observable(function (subscriber) {
            console.log("Getting classroom subscription features..");
            _this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(_this.classSessionId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                _this.classSessionFeatures = features;
                subscriber.next(features);
            }, function (error) { console.log("Could not get classroom subscription features"); });
        });
    }
    CoursesIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getCourses();
    };
    ;
    CoursesIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getCourses();
    };
    ;
    CoursesIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getCourses();
    };
    ;
    CoursesIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getCourses();
    };
    ;
    CoursesIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    CoursesIndexComponent.prototype.loadTutorSubscriptionFeatures = function (data) {
        if (data && data.length > 0) {
            this.classSessionId = data[0].classSessionId;
            this.getSubscriptionFeaturesByClassSessionId
                .subscribe(function (features) { }, function (error) { });
        }
    };
    CoursesIndexComponent.prototype.getCourses = function () {
        var _this = this;
        $('.loading').show();
        this.coursesService.getPaged(this.searchModel)
            .subscribe(function (success) {
            _this.results = success;
            //this.loadTutorSubscriptionFeatures(success.data);
            //this.loadTutorSubscriptionFeatures(success.data[0].classSessions);
            if (environment_1.environment.indexPageAnchoringEnabled == true) {
                if (environment_1.environment.smoothScroll == false) {
                    //quick and snappy
                    window.scroll(0, 0);
                }
                else {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            }
            $('.loading').hide();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    CoursesIndexComponent.prototype.ngOnInit = function () {
        this.searchModel.order = this.filter == 'upcoming' ? 'ASC' : 'DESC';
        this.searchModel.filter = this.filter;
        this.canActionTaken = this.actionTaken;
        this.getCourses();
        //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
        //    this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
        //    //this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
        //    //this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount
        //}, err => {
        //})
    };
    ;
    CoursesIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    CoursesIndexComponent.prototype.getLink = function (item) {
        if (this.filter == 'previous') {
            this.toastr.error('Action not allowed.');
            return;
        }
        debugger;
        var allowAccess;
        if (item.companyId != null && item.companyStripeConnectAccountId != null) {
            allowAccess = true;
        }
        else if (item.stripeConnectAccountId) {
            allowAccess = true;
        }
        else {
            allowAccess = false;
        }
        if ((item.started || item.published) && allowAccess) {
            var el = document.createElement('textarea');
            el.value = window.location.origin + '/Invitation-course-detail/' + item.courseId;
            //el.value = this.url + '/course/' + courseId;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.toastr.success('The link for this course has been copied to your clipboard');
        }
        else {
            this.toastr.error('Action not allowed.');
        }
    };
    ;
    CoursesIndexComponent.prototype.enterLesson = function (lesson) {
        if (!this.canViewLesson(lesson)) {
            this.toastr.error('Oops! Sorry, your subscription does not allow you to view completed lessons.');
            return;
        }
        if (lesson.sessionAttendeesCount > 0) {
            window.open(environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
        }
        else {
            this.toastr.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
        }
    };
    ;
    CoursesIndexComponent.prototype.canViewLesson = function (lesson) {
        if (!this.classSessionFeatures)
            return false;
        if (!lesson.complete && !lesson.ended)
            return true;
        var decision = (lesson.ownerId &&
            this.classSessionFeatures &&
            this.classSessionFeatures.tutorDashboard_View_CompletedLesson);
        return decision;
    };
    //show class sessions
    CoursesIndexComponent.prototype.showClassSession = function (item, typeOfSearch) {
        var dialogRef = this.dialog.open(course_class_sessions_dialog_component_1.CourseClassSessionsDialogComponent, {
            maxWidth: '80vw',
            //width: '100%',
            maxHeight: '75%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {
                course: item,
                tutorId: item.tutorId,
                isCompany: this.isCompany,
                classSessionFeatures: this.classSessionFeatures,
                comingFrom: typeOfSearch
            }
        });
    };
    //get invite sutdents
    CoursesIndexComponent.prototype.getInviteStudentsWindow = function (item) {
        debugger;
        if (this.filter == 'previous') {
            this.toastr.error('Action not allowed.');
            return;
        }
        //localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
        localStorage.setItem('clasSize', this.maxClassSize);
        localStorage.setItem('origin', this.maxClassSize);
        //if(item.dbsApprovalStatus != 'Pending' || !item.isUnder18)
        //{
        var allowAccess;
        if (item.companyId != null && item.companyStripeConnectAccountId != null && item.companyIDVerificationtStatus == "Approved") {
            allowAccess = true;
        }
        else if (item.stripeConnectAccountId && item.tutorIDVerificationtStatus == "Approved") {
            allowAccess = true;
        }
        else {
            allowAccess = false;
        }
        if (!item.cancelled && !item.completed && item.courseAttendeesCount != item.maxClassSize && allowAccess) {
            //const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
            //    maxWidth: '80vw',
            //    height: '90%',
            //    panelClass: 'my-dialog',
            //    data: {
            //        classSessionId: item.classSessions[0].classSessionId,
            //        selectedTutorId: item.tutorId
            //    }
            //});
            var dialogRef = this.dialog.open(invite_student_dialog_component_1.InviteStudentDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '90%',
                width: '55%',
                panelClass: ['myClass'],
                autoFocus: false,
                data: {
                    classSessionId: item.classSessions[0].classSessionId,
                    selectedTutorId: item.tutorId
                }
            });
            dialogRef.afterClosed().subscribe(function () {
                localStorage.removeItem('clasSize');
            });
        }
        else {
            this.toastr.error('Action not allowed.');
        }
        //}
        //else {
        //    this.toastr.error('Action not allowed.');
        //}
    };
    CoursesIndexComponent.prototype.editCourse = function (item, isCompany) {
        if (this.filter == 'previous') {
            this.toastr.error('Action not allowed.');
            return;
        }
        if (item.courseAttendeesCount == 0 && item.published) {
            //window.location.href = "/tutor/courses/edit-course?courseId=" + item.courseId;
            //this.onCourseEdit.emit(item.courseId);
            this.coursesService.setData(item.courseId);
            if (isCompany) {
                window.location.href = "/admin/courses/manage-course";
            }
            else {
                window.location.href = "/tutor/courses/create-course";
            }
        }
        else {
            this.toastr.error('Action not allowed.');
        }
        //if (item.courseAttendeesCount > 0 ) {
        //    this.toastr.warning('Course having participants now! You can not edit.');
        //    return false;
        //}
    };
    //delete courses
    CoursesIndexComponent.prototype.deleteCourse = function (item) {
        debugger;
        if (this.filter == 'previous') {
            this.toastr.error('Action not allowed.');
            return;
        }
        if (item.courseAttendeesCount == 0 || item.cancelled) {
            this.onCourseDelete.emit(item.courseId);
        }
        else {
            this.toastr.error('Action not allowed.');
        }
        //if (attendiesCount > 0) {
        //    this.toastr.warning('Course having participants now! You can not delete.');
        //    return false;
        //}
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CoursesIndexComponent.prototype, "filter", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CoursesIndexComponent.prototype, "onCourseEdit", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CoursesIndexComponent.prototype, "onCourseDelete", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CoursesIndexComponent.prototype, "actionTaken", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CoursesIndexComponent.prototype, "isCompany", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CoursesIndexComponent.prototype, "maxClassSize", void 0);
    CoursesIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-courses-index',
            templateUrl: './courses-index.component.html',
            styleUrls: ['./courses-index.component.css']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, index_2.TutorsService, index_2.CoursesService, ngx_toastr_1.ToastrService, index_2.ClassSessionFeaturesService])
    ], CoursesIndexComponent);
    return CoursesIndexComponent;
}());
exports.CoursesIndexComponent = CoursesIndexComponent;
//# sourceMappingURL=courses-index.component.js.map