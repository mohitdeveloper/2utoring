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
exports.TutorDbsDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var ng2_file_upload_1 = require("ng2-file-upload");
var helpers_1 = require("../../../helpers");
var tutor_info_dialog_component_1 = require("../tutors-index/tutor-info-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var TutorDbsDetailsComponent = /** @class */ (function () {
    function TutorDbsDetailsComponent(tutorCertificatesService, fb, toastr, tutorsService, dialog, usersService) {
        this.tutorCertificatesService = tutorCertificatesService;
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.dialog = dialog;
        this.usersService = usersService;
        this.serviceHelper = new helpers_1.ServiceHelper();
        this.dbsCheckFormSubmitted = false;
        this.uploader = new ng2_file_upload_1.FileUploader({ url: '', method: 'POST' });
        this.dropZoneOver = false;
        this.uploaderShow = true;
        this.alertMessage = null;
    }
    Object.defineProperty(TutorDbsDetailsComponent.prototype, "dbsCheckFormControls", {
        get: function () { return this.dbsCheckForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    TutorDbsDetailsComponent.prototype.ngOnInit = function () {
        this.resetForm();
        this.getUserAlertMessage();
    };
    TutorDbsDetailsComponent.prototype.resetForm = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.getMy()
            .subscribe(function (success) {
            debugger;
            _this.tutor = success;
            _this.uploader.options.url = _this.serviceHelper.baseApi + '/api/Tutors/DBSUpload/' + _this.tutor.tutorId;
            _this.dbsCheckFormSubmitted = false;
            _this.dbsCheckForm = _this.fb.group({
                tutorId: [success.tutorId],
                hasDbsCheck: [true],
                dbsCertificateNumber: [success.dbsCertificateNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.required]],
                isProfileCheck: [false]
            });
            $('.loading').hide();
        }, function (error) {
        });
    };
    ;
    TutorDbsDetailsComponent.prototype.submitDbsCheckForm = function () {
        var _this = this;
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            $('.loading').show();
            this.tutorsService.saveDbsCheck(this.dbsCheckForm.getRawValue())
                .subscribe(function (success) {
                _this.toastr.success('Your DBS info has been updated');
                _this.resetForm();
            }, function (error) {
            });
        }
    };
    ;
    TutorDbsDetailsComponent.prototype.fileOver = function (e) {
        this.dropZoneOver = e;
    };
    TutorDbsDetailsComponent.prototype.fileDropped = function (e) {
        var _this = this;
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.tutorsService.getMy()
                        .subscribe(function (success) {
                        _this.tutor = success;
                        $('.loading').hide();
                    }, function (error) {
                    });
                }
                else {
                    $('.loading').hide();
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.toastr.error('We were unable to upload your document');
                }
            };
        }
    };
    TutorDbsDetailsComponent.prototype.showInformation = function (type) {
        var dialogRef = this.dialog.open(tutor_info_dialog_component_1.TutorInfoDialogComponent, {
            maxWidth: type == 'RDBS' ? '75vw' : '75vw',
            data: { type: type }
        });
    };
    TutorDbsDetailsComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    TutorDbsDetailsComponent.prototype.markDbsStatusMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsStatusMessage').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDbsDetailsComponent.prototype.markDbsStatusMessageReadBasicTutor = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsStatusMessageBasicTutor').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDbsDetailsComponent.prototype.deleteCertificate = function (id, i) {
        var _this = this;
        this.tutorCertificatesService.delete(id).subscribe(function (res) {
            _this.toastr.success("Certificate has been removed.");
            _this.tutor.tutorCertificates.splice(i, 1);
        });
    };
    TutorDbsDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-dbs-details',
            templateUrl: './tutor-dbs-details.component.html',
            styleUrls: ['./tutor-dbs-details.component.css']
        }),
        __metadata("design:paramtypes", [services_1.TutorCertificatesService, forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, dialog_1.MatDialog, services_1.UsersService])
    ], TutorDbsDetailsComponent);
    return TutorDbsDetailsComponent;
}());
exports.TutorDbsDetailsComponent = TutorDbsDetailsComponent;
//# sourceMappingURL=tutor-dbs-details.component.js.map