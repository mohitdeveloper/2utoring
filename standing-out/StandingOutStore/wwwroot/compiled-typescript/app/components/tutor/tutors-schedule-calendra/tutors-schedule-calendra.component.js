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
exports.TutorInfoDialogComponent = void 0;
var core_1 = require("@angular/core");
var TutorInfoDialogComponent = /** @class */ (function () {
    function TutorInfoDialogComponent() {
        this.type = '';
    }
    TutorInfoDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-schedule-calender',
            templateUrl: 'tutors-schedule-calendra.html',
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], TutorInfoDialogComponent);
    return TutorInfoDialogComponent;
}());
exports.TutorInfoDialogComponent = TutorInfoDialogComponent;
//# sourceMappingURL=tutors-schedule-calendra.component.js.map