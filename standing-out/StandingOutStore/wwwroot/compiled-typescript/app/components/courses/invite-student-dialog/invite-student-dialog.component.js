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
exports.InviteStudentDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var InviteStudentDialogComponent = /** @class */ (function () {
    function InviteStudentDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.classSessionId = data.classSessionId;
        this.selectedTutorId = data.selectedTutorId;
    }
    InviteStudentDialogComponent.prototype.closeLessonDialog = function () {
        this.dialogRef.close();
    };
    InviteStudentDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-invite-student-dialog',
            templateUrl: './invite-student-dialog.component.html',
            styleUrls: ['./invite-student-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, Object])
    ], InviteStudentDialogComponent);
    return InviteStudentDialogComponent;
}());
exports.InviteStudentDialogComponent = InviteStudentDialogComponent;
//# sourceMappingURL=invite-student-dialog.component.js.map