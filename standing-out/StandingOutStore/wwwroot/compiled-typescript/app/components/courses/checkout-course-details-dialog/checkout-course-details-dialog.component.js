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
exports.CheckoutCourseDetailsDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var services_1 = require("../../../services");
var CheckoutCourseDetailsDialogComponent = /** @class */ (function () {
    function CheckoutCourseDetailsDialogComponent(dialogRef, settingsService, data) {
        this.dialogRef = dialogRef;
        this.settingsService = settingsService;
        this.data = data;
        this.parentStudentUserTypes = 'child';
        this.courseId = data.courseId;
    }
    CheckoutCourseDetailsDialogComponent.prototype.closeLessonDialog = function () {
        this.dialogRef.close();
    };
    CheckoutCourseDetailsDialogComponent.prototype.exsistingUser = function () {
        //window.location.href = '/course-sign-in/' + this.courseId;
        window.location.href = '/course-sign-in/' + this.courseId + '/Others';
        $('#aboutYouPage').css('display', 'none');
    };
    CheckoutCourseDetailsDialogComponent.prototype.newUser = function () {
        $('#aboutYouPage').css('display', 'block');
    };
    CheckoutCourseDetailsDialogComponent.prototype.onAboutCourseSelections = function (userType) {
        this.parentStudentUserTypes = userType;
    };
    CheckoutCourseDetailsDialogComponent.prototype.doRegister = function () {
        var _this = this;
        if (this.parentStudentUserTypes == 'child') {
            this.settingsService.getIdentitySiteUrl()
                .subscribe(function (success) {
                window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-student-enroll/' + _this.courseId;
            }, function (error) {
            });
            return true;
        }
        if (this.parentStudentUserTypes == 'parent') {
            this.settingsService.getIdentitySiteUrl()
                .subscribe(function (success) {
                window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-guardian-enroll/' + _this.courseId;
            }, function (error) {
            });
            return true;
        }
    };
    CheckoutCourseDetailsDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-course-details-dialog',
            templateUrl: './checkout-course-details-dialog.component.html',
            styleUrls: ['./checkout-course-details-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef,
            services_1.SettingsService, Object])
    ], CheckoutCourseDetailsDialogComponent);
    return CheckoutCourseDetailsDialogComponent;
}());
exports.CheckoutCourseDetailsDialogComponent = CheckoutCourseDetailsDialogComponent;
//# sourceMappingURL=checkout-course-details-dialog.component.js.map