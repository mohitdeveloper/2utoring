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
exports.DocumentPermissionModalComponent = void 0;
var core_1 = require("@angular/core");
var $ = require("jquery");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var services_1 = require("../../../services");
var DocumentPermissionModalComponent = /** @class */ (function () {
    function DocumentPermissionModalComponent(sessionDocumentsService, toastr, formBuilder, activeModal) {
        this.sessionDocumentsService = sessionDocumentsService;
        this.toastr = toastr;
        this.formBuilder = formBuilder;
        this.activeModal = activeModal;
        this.sessionAttendees = [];
        this.newSessionAttendees = [];
        this.newSessionAttendeesPermissionData = [];
        this.readToggle = false;
        this.writeToggle = false;
        this.isReadable = false;
        this.isWriteable = false;
    }
    DocumentPermissionModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        debugger;
        $('.loading').show();
        this.sessionDocumentsService.getAttendeesForFileUpload(this.classSessionId).subscribe(function (success) {
            _this.sessionAttendees = success;
            var that = _this;
            console.log(_this.sessionAttendees);
            _this.sessionDocumentsService.getGoogleFilePermission(_this.classSessionId, _this.fileIds[0]).subscribe(function (data) {
                _this.newSessionAttendeesPermissionData = data;
                //------------------------------------------------------------------------------------------------
                that.sessionAttendees.forEach(function (value, key) {
                    debugger;
                    data.forEach(function (value2, key2) {
                        if (value2.sessionAttendeeId == value.sessionAttendeeId) {
                            that.sessionAttendees[key].isReadable = value2.isReadable;
                            that.sessionAttendees[key].isWriteable = value2.isWriteable;
                            //that.sessionAttendees[key].folderName = that.type;
                        }
                    });
                    that.sessionAttendees[key].folderName = that.type;
                });
                //------------------------------------------------------------------------------------------------
                //this.sessionAttendees[0].isReadable = data[0].isReadable;
                //this.sessionAttendees[0].isWriteable = data[0].isWriteable;
                $('.loading').hide();
            }, function (err) {
            });
            $('.loading').hide();
        }, function (err) {
        });
    };
    DocumentPermissionModalComponent.prototype.readBulkToggle = function () {
        var _this = this;
        this.sessionAttendees.forEach(function (o) {
            return o.email ? o.isReadable = _this.readToggle : false;
        });
    };
    ;
    DocumentPermissionModalComponent.prototype.writeBulkToggle = function () {
        var _this = this;
        this.sessionAttendees.forEach(function (o) {
            return o.email ? o.isWriteable = _this.writeToggle : false;
        });
    };
    ;
    DocumentPermissionModalComponent.prototype.submit = function () {
        var _this = this;
        $('.loading').show();
        this.sessionAttendees.forEach(function (o) {
            if (o.email != null) {
                debugger;
                _this.newSessionAttendees.push(o);
            }
        });
        debugger;
        this.sessionDocumentsService.updatePermissions(this.classSessionId, { fileIds: this.fileIds, sessionAttendees: this.newSessionAttendees })
            .subscribe(function (success) {
            _this.toastr.success('File Permissions Updated.');
            _this.activeModal.close();
        }, function (err) {
            _this.toastr.error('Failed to update Permissions.');
            $('.loading').hide();
        });
    };
    ;
    DocumentPermissionModalComponent.prototype.closeModal = function () {
        this.activeModal.dismiss();
    };
    ;
    DocumentPermissionModalComponent.prototype.sendRequestToConnectGoogleAccount = function (sessionAttendeeId) {
        var _this = this;
        debugger;
        $('.loading').show();
        this.sessionDocumentsService.sendRequestToLinkGoogleAccount(sessionAttendeeId).subscribe(function (success) {
            if (success) {
                _this.toastr.success('Request sent successfully!');
            }
            else {
                _this.toastr.error('Something went wrong!');
            }
            $('.loading').hide();
        }, function (err) {
            $('.loading').hide();
        });
    };
    DocumentPermissionModalComponent = __decorate([
        core_1.Component({
            selector: 'app-document-permission-modal',
            templateUrl: './document-permission-modal.component.html',
            styleUrls: ['./document-permission-modal.component.scss']
        })
        // VIEW ONLY
        ,
        __metadata("design:paramtypes", [services_1.SessionDocumentsService, ngx_toastr_1.ToastrService, forms_1.FormBuilder,
            ng_bootstrap_1.NgbActiveModal])
    ], DocumentPermissionModalComponent);
    return DocumentPermissionModalComponent;
}());
exports.DocumentPermissionModalComponent = DocumentPermissionModalComponent;
//# sourceMappingURL=document-permission-modal.component.js.map