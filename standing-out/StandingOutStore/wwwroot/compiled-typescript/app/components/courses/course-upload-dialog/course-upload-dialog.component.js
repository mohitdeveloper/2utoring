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
exports.CourseUploadDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var class_sessions_material_component_1 = require("../../class-sessions/class-sessions-material/class-sessions-material.component");
var CourseUploadDialogComponent = /** @class */ (function () {
    function CourseUploadDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.passData = new core_1.EventEmitter();
        debugger;
        this.classSessionId = data.classSessionId;
        this.selectedTutorId = data.selectedTutorId;
        this.selectedIndex = data.selectedIndex ? data.selectedIndex : -1;
    }
    CourseUploadDialogComponent.prototype.closeLessonDialog = function () {
        this.passData.emit(this.classsSessionRef);
        this.dialogRef.close();
    };
    __decorate([
        core_1.ViewChild('classsSessionRef'),
        __metadata("design:type", class_sessions_material_component_1.ClassSessionsMaterialComponent)
    ], CourseUploadDialogComponent.prototype, "classsSessionRef", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CourseUploadDialogComponent.prototype, "passData", void 0);
    CourseUploadDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-course-class-sessions-dialog',
            templateUrl: './course-upload-dialog.component.html',
            styleUrls: ['./course-upload-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, Object])
    ], CourseUploadDialogComponent);
    return CourseUploadDialogComponent;
}());
exports.CourseUploadDialogComponent = CourseUploadDialogComponent;
//# sourceMappingURL=course-upload-dialog.component.js.map