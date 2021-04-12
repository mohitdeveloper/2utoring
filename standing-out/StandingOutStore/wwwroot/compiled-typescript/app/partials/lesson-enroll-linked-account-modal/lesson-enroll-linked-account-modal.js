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
exports.LessonEnrollLinkedAccountModal = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var LessonEnrollLinkedAccountModal = /** @class */ (function () {
    function LessonEnrollLinkedAccountModal(activeModal) {
        this.activeModal = activeModal;
        this.currentUrl = window.location.href;
    }
    LessonEnrollLinkedAccountModal.prototype.ngOnInit = function () {
    };
    LessonEnrollLinkedAccountModal.prototype.close = function () {
        this.activeModal.dismiss();
    };
    ;
    LessonEnrollLinkedAccountModal = __decorate([
        core_1.Component({
            selector: 'app-lesson-enroll-linked-account-modal',
            templateUrl: './lesson-enroll-linked-account-modal.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal])
    ], LessonEnrollLinkedAccountModal);
    return LessonEnrollLinkedAccountModal;
}());
exports.LessonEnrollLinkedAccountModal = LessonEnrollLinkedAccountModal;
//# sourceMappingURL=lesson-enroll-linked-account-modal.js.map