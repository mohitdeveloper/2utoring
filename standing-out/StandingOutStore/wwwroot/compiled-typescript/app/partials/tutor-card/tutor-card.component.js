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
exports.TutorCardComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../models/index");
var TutorCardComponent = /** @class */ (function () {
    function TutorCardComponent() {
    }
    TutorCardComponent.prototype.getSubjectString = function () {
        if (this.tutor.subjects.length > 1) {
            return this.tutor.subjects.slice(0, this.tutor.subjects.length - 1).join(', ') + " & " + this.tutor.subjects[this.tutor.subjects.length - 1];
        }
        else if (this.tutor.subjects.length == 1) {
            return this.tutor.subjects[0];
        }
        else {
            return '';
        }
    };
    ;
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.TutorCard)
    ], TutorCardComponent.prototype, "tutor", void 0);
    TutorCardComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-card',
            templateUrl: './tutor-card.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], TutorCardComponent);
    return TutorCardComponent;
}());
exports.TutorCardComponent = TutorCardComponent;
//# sourceMappingURL=tutor-card.component.js.map