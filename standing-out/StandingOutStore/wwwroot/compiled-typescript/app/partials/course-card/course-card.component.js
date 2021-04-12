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
exports.CourseCardComponent = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var utilities_alert_modal_1 = require("../../components/utilities/utilities-alert-modal/utilities-alert-modal");
var course_lesson_sign_in_modal_1 = require("../course-lesson-sign-in-modal/course-lesson-sign-in-modal");
var CourseCardComponent = /** @class */ (function () {
    function CourseCardComponent(modalService) {
        this.modalService = modalService;
        this.selected = null;
        this.displayLarge = false;
        this.displayTutor = true;
        this.moreInfoNavOn = false;
        this.canUserBuy = true;
        this.isLoggedIn = false;
        this.isGuardian = false;
        this.grandTotal = 0;
    }
    CourseCardComponent.prototype.ngOnInit = function () {
        this.allLessons = this.lesson;
        for (var i = 0; i < this.allLessons.length; i++) {
            this.grandTotal += this.allLessons[i].sessionPrice;
        }
    };
    CourseCardComponent.prototype.lessonDescription = function (lessonObj) {
        debugger;
        if (lessonObj == null)
            return '';
        else if (this.displayLarge)
            return lessonObj.sessionDescriptionBody;
        else if (lessonObj.sessionDescriptionBody.length > 300)
            return lessonObj.sessionDescriptionBody.substring(0, 299) + '...';
        else
            return lessonObj.sessionDescriptionBody;
    };
    CourseCardComponent.prototype.selectLesson = function (event) {
        event.stopPropagation();
        // if (this.lesson.sessionRemainingSpaces > 0) {
        if (this.isLoggedIn) {
            window.location.href = '/course-' + (this.isGuardian ? 'guardian' : 'student') + '-enroll/' + this.course.courseId;
        }
        else {
            var modalRef = this.modalService.open(course_lesson_sign_in_modal_1.CourseLessonSignInModal, { size: 'lg' });
            //set any variables
            modalRef.componentInstance.classSessionId = this.course.courseId;
            modalRef.componentInstance.name = this.course.name;
            modalRef.componentInstance.subject = this.course.subjectName;
            modalRef.componentInstance.subjectCategory = this.course.subjectCategoryName;
            modalRef.componentInstance.studyLevel = this.course.studyLevelName;
            //handle the response
            modalRef.result.then(function (result) {
            }, function (reason) {
            });
        }
        //}
    };
    ;
    CourseCardComponent.prototype.removeLesson = function (event) {
        var _this = this;
        event.stopPropagation();
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'md' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Cancel Purchase';
        modalRef.componentInstance.message = 'Are you sure you want to cancel your purchase of this lesson?';
        modalRef.componentInstance.noButtonText = 'No, return to purchase';
        modalRef.componentInstance.yesButtonText = 'Yes, back to search';
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                window.location.href = '/find-a-lesson' + (_this.lesson.isUnder16 ? '' : '?under=false');
            }
        }, function (reason) {
        });
    };
    ;
    CourseCardComponent.prototype.moreInfo = function () {
        if (this.moreInfoNavOn) {
            window.location.href = '/lesson/' + this.lesson.classSessionId;
        }
    };
    ;
    CourseCardComponent.prototype.getSubjectString = function () {
        if (this.lesson.tutorSubjects.length > 1) {
            return this.lesson.tutorSubjects.slice(0, this.lesson.tutorSubjects.length - 1).join(', ') + " & " + this.lesson.tutorSubjects[this.lesson.tutorSubjects.length - 1];
        }
        else if (this.lesson.tutorSubjects.length == 1) {
            return this.lesson.tutorSubjects[0];
        }
        else {
            return '';
        }
    };
    ;
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CourseCardComponent.prototype, "lesson", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "displayLarge", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "displayTutor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "moreInfoNavOn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "canUserBuy", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "isLoggedIn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CourseCardComponent.prototype, "isGuardian", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CourseCardComponent.prototype, "course", void 0);
    CourseCardComponent = __decorate([
        core_1.Component({
            selector: 'app-course-card',
            templateUrl: './course-card.component.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal])
    ], CourseCardComponent);
    return CourseCardComponent;
}());
exports.CourseCardComponent = CourseCardComponent;
//# sourceMappingURL=course-card.component.js.map