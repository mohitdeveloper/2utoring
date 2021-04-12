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
exports.CourseLessonSignInModal = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var services_1 = require("../../services");
var CourseLessonSignInModal = /** @class */ (function () {
    function CourseLessonSignInModal(activeModal, settingsService) {
        this.activeModal = activeModal;
        this.settingsService = settingsService;
        this.subjectCategory = null;
    }
    CourseLessonSignInModal.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getIdentitySiteUrl()
            .subscribe(function (success) {
            _this.identitySiteUrl = success;
        }, function (error) {
        });
    };
    CourseLessonSignInModal.prototype.signInStudent = function () {
        debugger;
        window.location.href = '/course-student-enroll/' + this.classSessionId;
    };
    ;
    CourseLessonSignInModal.prototype.signInGaurdian = function () {
        debugger;
        window.location.href = '/course-guardian-enroll/' + this.classSessionId;
    };
    ;
    CourseLessonSignInModal.prototype.close = function () {
        this.activeModal.dismiss();
    };
    ;
    CourseLessonSignInModal = __decorate([
        core_1.Component({
            selector: 'app-course-lesson-sign-in-modal',
            templateUrl: './course-lesson-sign-in-modal.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, services_1.SettingsService])
    ], CourseLessonSignInModal);
    return CourseLessonSignInModal;
}());
exports.CourseLessonSignInModal = CourseLessonSignInModal;
//# sourceMappingURL=course-lesson-sign-in-modal.js.map