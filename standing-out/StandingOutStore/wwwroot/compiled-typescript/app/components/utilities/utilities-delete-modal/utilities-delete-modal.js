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
exports.UtilitiesDeleteModal = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var UtilitiesDeleteModal = /** @class */ (function () {
    function UtilitiesDeleteModal(activeModal) {
        this.activeModal = activeModal;
    }
    UtilitiesDeleteModal.prototype.remove = function (result) {
        this.activeModal.close(result);
    };
    UtilitiesDeleteModal.prototype.closeModal = function () {
        this.activeModal.dismiss(false);
    };
    UtilitiesDeleteModal = __decorate([
        core_1.Component({
            selector: 'app-utilities-delete-modal',
            templateUrl: './utilities-delete-modal.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal])
    ], UtilitiesDeleteModal);
    return UtilitiesDeleteModal;
}());
exports.UtilitiesDeleteModal = UtilitiesDeleteModal;
//# sourceMappingURL=utilities-delete-modal.js.map