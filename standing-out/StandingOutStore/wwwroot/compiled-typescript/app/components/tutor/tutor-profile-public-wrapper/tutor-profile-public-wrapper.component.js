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
exports.TutorProfilePublicWrapperComponent = void 0;
var core_1 = require("@angular/core");
var TutorProfilePublicWrapperComponent = /** @class */ (function () {
    function TutorProfilePublicWrapperComponent() {
        this.tutorId = tutorId;
    }
    TutorProfilePublicWrapperComponent.prototype.ngOnInit = function () {
    };
    TutorProfilePublicWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-profile-public-wrapper',
            templateUrl: './tutor-profile-public-wrapper.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], TutorProfilePublicWrapperComponent);
    return TutorProfilePublicWrapperComponent;
}());
exports.TutorProfilePublicWrapperComponent = TutorProfilePublicWrapperComponent;
//# sourceMappingURL=tutor-profile-public-wrapper.component.js.map