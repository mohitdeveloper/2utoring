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
exports.TutorInviteModalComponent = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var services_1 = require("../../../services");
var TutorInviteModalComponent = /** @class */ (function () {
    function TutorInviteModalComponent(activeModal, tutorsService) {
        this.activeModal = activeModal;
        this.tutorsService = tutorsService;
    }
    TutorInviteModalComponent.prototype.submit = function () {
        debugger;
        if (this.bulkEmailString != undefined && this.bulkEmailString != '') {
            this.activeModal.close(this.bulkEmailString);
        }
    };
    TutorInviteModalComponent.prototype.closeModal = function () {
        this.activeModal.dismiss(null);
    };
    TutorInviteModalComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-invite-modal',
            templateUrl: './tutor-invite-modal.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, services_1.TutorsService])
    ], TutorInviteModalComponent);
    return TutorInviteModalComponent;
}());
exports.TutorInviteModalComponent = TutorInviteModalComponent;
//# sourceMappingURL=tutor-invite-modal.js.map