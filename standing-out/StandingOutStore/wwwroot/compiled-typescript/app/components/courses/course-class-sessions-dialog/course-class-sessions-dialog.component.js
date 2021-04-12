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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseClassSessionsDialogComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var dialog_1 = require("@angular/material/dialog");
var __1 = require("../..");
var course_upload_dialog_component_1 = require("../course-upload-dialog/course-upload-dialog.component");
var session_groups_modal_component_1 = require("../../session-groups/session-groups-modal.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var CourseClassSessionsDialogComponent = /** @class */ (function () {
    function CourseClassSessionsDialogComponent(tutorsService, classSessionFeaturesService, dialog, modalService, dialogRef, data, toastr, classSessionService) {
        this.tutorsService = tutorsService;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.dialog = dialog;
        this.modalService = modalService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastr = toastr;
        this.classSessionService = classSessionService;
        this.tutorCommand = new index_1.TutorCommandGroup();
        this.classSessionFeatures = new index_1.ClassSessionFeatures();
        this.userLocalLogin = false;
        this.userHasGoogleAccountLinked = false;
    }
    CourseClassSessionsDialogComponent.prototype.closeLessonDialog = function () {
        this.dialogRef.close();
    };
    CourseClassSessionsDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.comingFrom = this.data.comingFrom ? this.data.comingFrom : 'upcoming';
        this.classSessions = this.data.course.classSessions;
        this.tutorId = this.data.tutorId ? this.data.tutorId : '';
        this.isCompany = this.data.isCompany ? this.data.isCompany : false;
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(this.tutorId)
            .subscribe(function (features) { _this.classSessionFeatures = features; });
        debugger;
        this.tutorsService.getById(this.tutorId)
            .subscribe(function (success) {
            _this.userLocalLogin = success.localLogin;
            _this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
        }, function (error) {
        });
    };
    CourseClassSessionsDialogComponent.prototype.openClassSessionDetail = function (items) {
        debugger;
        //if (!items.started && items.sessionAttendeesCount > 0) {
        if (items.sessionAttendeesCount > 0) {
            var dialogRef = this.dialog.open(__1.ClassSessionsRegisterComponent, {
                width: '60vw',
                panelClass: 'myClass',
                autoFocus: false,
                data: { classSessionId: items.classSessionId, sessionAttendeesCount: items.sessionAttendeesCount, lessondetail: items, isAdd: false, that: this }
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    };
    CourseClassSessionsDialogComponent.prototype.openClassSessionAndAddGroup = function (items) {
        if (!items.started && items.sessionAttendeesCount > 1) {
            var dialogRef = this.dialog.open(__1.ClassSessionsRegisterComponent, {
                width: '60vw',
                panelClass: 'myClass',
                autoFocus: false,
                data: { classSessionId: items.classSessionId, sessionAttendeesCount: items.sessionAttendeesCount, lessondetail: items, isAdd: true, that: this }
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    };
    CourseClassSessionsDialogComponent.prototype.getFileUploadWindow = function (items, classSessionId, index) {
        if (!items.started || (items.started && items.ended)) {
            var dialogRef = this.dialog.open(course_upload_dialog_component_1.CourseUploadDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '85%',
                //height: '90%',
                panelClass: 'myClass',
                autoFocus: false,
                data: {
                    classSessionId: classSessionId,
                    selectedTutorId: this.tutorId
                }
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    };
    CourseClassSessionsDialogComponent.prototype.allowStartLesson = function (dt) {
        var today = new Date().getTime();
        var startDate = new Date(dt).getTime();
        var diffMs = (today - startDate); // milliseconds between now & startDate
        var diffMins = Math.round(diffMs / 60000); // minutes
        if (diffMins > 15)
            return true;
        return false;
    };
    CourseClassSessionsDialogComponent.prototype.viewLesson = function (items, index) {
        var _this = this;
        debugger;
        $('.loading').show();
        var current = new Date().getTime();
        var endDate = new Date(items.endDate).getTime();
        if ((current > endDate || this.allowStartLesson(items.startDate)) && !items.complete) {
            this.classSessionService.cancelLesson(items.classSessionId)
                .subscribe(function (success) {
                if (success == "Completed") {
                    items.complete = true;
                    items.ended = true;
                    _this.allowViewLesson(items);
                }
                else if (success == "Cancelled") {
                    items.cancel = true;
                    _this.toastr.warning('Sorry! Lesson Timeout');
                    $('.loading').hide();
                    return false;
                }
                else {
                    items.complete = true;
                    items.ended = true;
                    _this.allowViewLesson(items);
                }
            }, function (error) { console.log(error); });
        }
        else {
            this.allowViewLesson(items);
        }
        //if (this.comingFrom == 'old' || this.comingFrom == 'upcoming') {
        //    this.toastr.error('Action not allowed.');
        //    return;
        //}
        //if (this.comingFrom == 'old' || this.comingFrom == 'upcoming') {
        //    this.toastr.error('Action not allowed.');
        //    return;
        //}
        //if ((this.allowStartLesson(items.startDate) || items.cancel) && !items.complete) {
        //    debugger;
        //    items.cancel = true;
        //    this.toastr.warning('Sorry! Lesson Timeout');
        //    return;
        //}
    };
    CourseClassSessionsDialogComponent.prototype.allowViewLesson = function (items) {
        debugger;
        $('.loading').hide();
        if (items.started && items.ended) {
            if (!this.isCompany) {
                if (items.sessionAttendeesCount > 0) {
                    if (items.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == false) {
                        window.location.href = "/Account/LinkAccount?returnUrl=" + environment_1.environment.classroomUrl + '/c/' + items.classSessionId;
                    }
                    else if (items.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == true) {
                        window.location.href = "/Account/LoginAccount?returnUrl=" + environment_1.environment.classroomUrl + '/c/' + items.classSessionId;
                    }
                    else {
                        window.open(environment_1.environment.classroomUrl + '/c/' + items.classSessionId, '_blank');
                    }
                }
                else {
                    this.toastr.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
                }
            }
            else {
                this.toastr.error('Action not allowed.');
                return;
            }
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    };
    CourseClassSessionsDialogComponent.prototype.canAddGroup = function () {
        var groupCount = 0;
        if (this.tutorCommand.groups)
            groupCount = this.tutorCommand.groups.length;
        var currentGroupsCount = groupCount;
        console.log("MaxGroups", this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups);
        if (this.classSessionFeatures && currentGroupsCount < this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups)
            return true;
        return false;
    };
    CourseClassSessionsDialogComponent.prototype.addGroup = function (items) {
        var _this = this;
        if (!items.started && items.sessionAttendeesCount > 1) {
            if (!this.canAddGroup()) {
                this.toastr.error('Action not allowed.');
                return;
            }
            var modalRef = this.modalService.open(session_groups_modal_component_1.SessionGroupsModalComponent, { size: 'lg' });
            var group = new index_1.SessionGroupDraggable();
            group.classSessionId = items.classSessionId;
            //set any variables
            modalRef.componentInstance.classSessionId = items.classSessionId;
            modalRef.componentInstance.group = group;
            //handle the response
            modalRef.result.then(function (result) {
                if (result !== undefined && result != null) {
                    _this.tutorCommand.groups.push(result);
                    $('.loading').hide();
                }
            }, function (reason) {
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    };
    ;
    CourseClassSessionsDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-course-class-sessions-dialog',
            templateUrl: './course-class-sessions-dialog.component.html',
            styleUrls: ['./course-class-sessions-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(5, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [index_2.TutorsService, index_2.ClassSessionFeaturesService, dialog_1.MatDialog, ng_bootstrap_1.NgbModal, dialog_1.MatDialogRef, Object, ngx_toastr_1.ToastrService, index_2.ClassSessionsService])
    ], CourseClassSessionsDialogComponent);
    return CourseClassSessionsDialogComponent;
}());
exports.CourseClassSessionsDialogComponent = CourseClassSessionsDialogComponent;
//# sourceMappingURL=course-class-sessions-dialog.component.js.map