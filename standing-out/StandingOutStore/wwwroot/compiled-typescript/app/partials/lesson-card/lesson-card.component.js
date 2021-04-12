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
exports.LessonCardComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../models/index");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var lesson_sign_in_modal_1 = require("../lesson-sign-in-modal/lesson-sign-in-modal");
var utilities_alert_modal_1 = require("../../components/utilities/utilities-alert-modal/utilities-alert-modal");
var LessonCardComponent = /** @class */ (function () {
    function LessonCardComponent(modalService) {
        this.modalService = modalService;
        this.selected = null;
        this.displayLarge = false;
        this.displayTutor = true;
        this.moreInfoNavOn = false;
        this.canUserBuy = true;
        this.isLoggedIn = false;
        this.isGuardian = false;
    }
    LessonCardComponent.prototype.lessonDescription = function () {
        if (this.lesson == null)
            return '';
        else if (this.displayLarge)
            return this.lesson.sessionDescriptionBody;
        else if (this.lesson.sessionDescriptionBody.length > 300)
            return this.lesson.sessionDescriptionBody.substring(0, 299) + '...';
        else
            return this.lesson.sessionDescriptionBody;
    };
    LessonCardComponent.prototype.selectLesson = function (event) {
        event.stopPropagation();
        if (this.lesson.sessionRemainingSpaces > 0) {
            if (this.isLoggedIn) {
                window.location.href = '/' + (this.isGuardian ? 'guardian' : 'student') + '-enroll/' + this.lesson.classSessionId;
            }
            else {
                var modalRef = this.modalService.open(lesson_sign_in_modal_1.LessonSignInModal, { size: 'lg' });
                //set any variables
                modalRef.componentInstance.classSessionId = this.lesson.classSessionId;
                modalRef.componentInstance.name = this.lesson.sessionName;
                modalRef.componentInstance.subject = this.lesson.subjectName;
                modalRef.componentInstance.subjectCategory = this.lesson.subjectCategoryName;
                modalRef.componentInstance.studyLevel = this.lesson.studyLevelName;
                //handle the response
                modalRef.result.then(function (result) {
                }, function (reason) {
                });
            }
        }
    };
    ;
    LessonCardComponent.prototype.removeLesson = function (event) {
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
    LessonCardComponent.prototype.moreInfo = function () {
        if (this.moreInfoNavOn) {
            window.location.href = '/lesson/' + this.lesson.classSessionId;
        }
    };
    ;
    LessonCardComponent.prototype.getSubjectString = function () {
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
        __metadata("design:type", index_1.LessonCard)
    ], LessonCardComponent.prototype, "lesson", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.LessonCard)
    ], LessonCardComponent.prototype, "course", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "displayLarge", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "displayTutor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "moreInfoNavOn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "canUserBuy", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "isLoggedIn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LessonCardComponent.prototype, "isGuardian", void 0);
    LessonCardComponent = __decorate([
        core_1.Component({
            selector: 'app-lesson-card',
            templateUrl: './lesson-card.component.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal])
    ], LessonCardComponent);
    return LessonCardComponent;
}());
exports.LessonCardComponent = LessonCardComponent;
//# sourceMappingURL=lesson-card.component.js.map