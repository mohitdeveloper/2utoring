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
exports.SessionGroupsModalComponent = void 0;
var services_1 = require("../../services");
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var SessionGroupsModalComponent = /** @class */ (function () {
    function SessionGroupsModalComponent(activeModal, formBuilder, toastr, sessionGroupsService) {
        this.activeModal = activeModal;
        this.formBuilder = formBuilder;
        this.toastr = toastr;
        this.sessionGroupsService = sessionGroupsService;
        this.groupForm = this.formBuilder.group({});
        this.groupFormSubmitted = false;
    }
    Object.defineProperty(SessionGroupsModalComponent.prototype, "groupFormControls", {
        get: function () { return this.groupForm.controls; },
        enumerable: false,
        configurable: true
    });
    SessionGroupsModalComponent.prototype.ngOnInit = function () {
        this.setupForm();
    };
    ;
    SessionGroupsModalComponent.prototype.setupForm = function () {
        this.groupForm = this.formBuilder.group({
            classSessionId: [this.group.classSessionId],
            sessionGroupId: [this.group.sessionGroupId],
            name: [this.group.name, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
        });
    };
    ;
    SessionGroupsModalComponent.prototype.save = function (group) {
        var _this = this;
        this.groupFormSubmitted = true;
        if (this.groupForm.valid) {
            $('.loading').show();
            this.group = group;
            if (this.group.sessionGroupId !== undefined && this.group.sessionGroupId != null && this.group.sessionGroupId != '') {
                this.sessionGroupsService.update(this.classSessionId, this.group.sessionGroupId, this.group).subscribe(function (success) {
                    _this.group = success;
                    _this.toastr.success('Save successful.', 'Success');
                    _this.group.accordianCollapsed = false;
                    _this.activeModal.close(_this.group);
                }, function (err) {
                    _this.toastr.error('Save Unsuccessful.', 'Error');
                    _this.activeModal.close(null);
                    $('.loading').hide();
                });
            }
            else {
                this.sessionGroupsService.create(this.classSessionId, this.group).subscribe(function (success) {
                    _this.group = success;
                    _this.toastr.success('Save successful.', 'Success');
                    _this.group.accordianCollapsed = false;
                    _this.activeModal.close(_this.group);
                }, function (err) {
                    _this.toastr.error('Save Unsuccessful.', 'Error');
                    _this.activeModal.close(null);
                    $('.loading').hide();
                });
            }
        }
    };
    ;
    SessionGroupsModalComponent.prototype.closeModal = function () {
        this.activeModal.dismiss();
    };
    ;
    SessionGroupsModalComponent = __decorate([
        core_1.Component({
            selector: 'app-session-groups-modal',
            templateUrl: './session-groups-modal.component.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, forms_1.FormBuilder, ngx_toastr_1.ToastrService,
            services_1.SessionGroupsService])
    ], SessionGroupsModalComponent);
    return SessionGroupsModalComponent;
}());
exports.SessionGroupsModalComponent = SessionGroupsModalComponent;
//# sourceMappingURL=session-groups-modal.component.js.map