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
exports.DbsCheckDialog = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var forms_1 = require("@angular/forms");
var DbsCheckDialog = /** @class */ (function () {
    function DbsCheckDialog(fb, data, dialogRef) {
        this.fb = fb;
        this.data = data;
        this.dialogRef = dialogRef;
        this.dbsCheckFormSubmitted = false;
    }
    Object.defineProperty(DbsCheckDialog.prototype, "dbsCheckFormControls", {
        get: function () { return this.dbsCheckForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    DbsCheckDialog.prototype.ngOnInit = function () {
        this.dbsCheckForm = this.fb.group({
            dbsCertificateNumber: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            hasDbsCheck: [false, [forms_1.Validators.required]]
        });
    };
    DbsCheckDialog.prototype.closeModal = function (dbsCheckData) {
        this.dialogRef.close(dbsCheckData);
    };
    DbsCheckDialog.prototype.hasDbsCheckValueChange = function () {
        this.dbsCheckForm.get('dbsCertificateNumber').clearValidators();
        if (this.dbsCheckFormControls.hasDbsCheck.value == true) {
            this.dbsCheckForm.get('dbsCertificateNumber').setValidators([forms_1.Validators.required, forms_1.Validators.maxLength(250)]);
        }
        this.dbsCheckForm.get('dbsCertificateNumber').updateValueAndValidity();
    };
    ;
    DbsCheckDialog.prototype.submitDbsCheckFormSub = function () {
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            this.dbsCheckData = this.dbsCheckForm.getRawValue();
        }
        else {
            this.dbsCheckData = {
                'dbsCertificateNumber': '',
                'hasDbsCheck': false
            };
        }
        this.closeModal(this.dbsCheckData);
        var $container = $("html,body");
        var $scrollTo = $('.Form_Block-Controls');
        $container.animate({ scrollTop: $scrollTo.offset().top + 1000, scrollLeft: 0 }, 300);
    };
    ;
    DbsCheckDialog = __decorate([
        core_1.Component({
            selector: 'app-dbscheck-dialog',
            templateUrl: 'dbscheck-dialog.html',
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [forms_1.FormBuilder, Object, dialog_1.MatDialogRef])
    ], DbsCheckDialog);
    return DbsCheckDialog;
}());
exports.DbsCheckDialog = DbsCheckDialog;
//# sourceMappingURL=dbscheck-dialog.component.js.map