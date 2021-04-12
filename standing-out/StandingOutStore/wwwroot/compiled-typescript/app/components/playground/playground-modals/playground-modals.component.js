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
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var utilities_delete_modal_1 = require("../../utilities/utilities-delete-modal/utilities-delete-modal");
var utilities_alert_modal_1 = require("../../utilities/utilities-alert-modal/utilities-alert-modal");
var PlaygroundModalsComponent = /** @class */ (function () {
    function PlaygroundModalsComponent(modalService) {
        this.modalService = modalService;
    }
    PlaygroundModalsComponent.prototype.showDelete = function () {
        this.modalService.open(utilities_delete_modal_1.UtilitiesDeleteModal, { ariaLabelledBy: 'modal-basic-title' }).result
            .then(function (result) {
            alert('delete? ' + result);
            console.log('delete? ' + result);
        }, function (reason) {
            alert('dsmissed - closed no action');
            console.log('dsmissed - closed no action');
        });
    };
    PlaygroundModalsComponent.prototype.showAlert = function () {
        //open modal
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Test Alert Popup with Confirmation buttons and large popup style';
        modalRef.componentInstance.message = 'This is the content';
        modalRef.componentInstance.noButtonText = 'No take me back!';
        modalRef.componentInstance.yesButtonText = 'Yes go!';
        //handle the response
        modalRef.result.then(function (result) {
            alert('result? ' + result);
            console.log('result? ' + result);
        }, function (reason) {
            alert('dsmissed - closed no action');
            console.log('dsmissed - closed no action');
        });
    };
    PlaygroundModalsComponent.prototype.ngOnInit = function () {
    };
    PlaygroundModalsComponent = __decorate([
        core_1.Component({
            selector: 'app-playground-modals',
            templateUrl: './playground-modals.component.html',
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal])
    ], PlaygroundModalsComponent);
    return PlaygroundModalsComponent;
}());
exports.PlaygroundModalsComponent = PlaygroundModalsComponent;
//# sourceMappingURL=playground-modals.component.js.map