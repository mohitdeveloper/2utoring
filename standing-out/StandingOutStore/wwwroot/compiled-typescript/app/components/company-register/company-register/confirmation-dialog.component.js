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
exports.ConfirmationDialog = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ConfirmationDialog = /** @class */ (function () {
    function ConfirmationDialog(data, dialogRef) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.message = "Are you sure?";
        this.confirmButtonText = "Yes";
        this.cancelButtonText = "Cancel";
        if (data) {
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            }
        }
    }
    ConfirmationDialog.prototype.onConfirmClick = function () {
        this.dialogRef.close(true);
    };
    ConfirmationDialog = __decorate([
        core_1.Component({
            selector: 'confirmation-dialog',
            templateUrl: './confirmation-dialog.html',
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, dialog_1.MatDialogRef])
    ], ConfirmationDialog);
    return ConfirmationDialog;
}());
exports.ConfirmationDialog = ConfirmationDialog;
//# sourceMappingURL=confirmation-dialog.component.js.map