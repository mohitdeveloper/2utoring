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
exports.ClassSessionsMaterialComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var service_helper_1 = require("../../../helpers/service.helper");
var $ = require("jquery");
var dialog_1 = require("@angular/material/dialog");
var ClassSessionsMaterialComponent = /** @class */ (function () {
    function ClassSessionsMaterialComponent(dialogRef, fb, toastr, tutorsService, sessionMediasService, enumsService, classSessionsService, companyService) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.sessionMediasService = sessionMediasService;
        this.enumsService = enumsService;
        this.classSessionsService = classSessionsService;
        this.companyService = companyService;
        this.serviceHelper = new service_helper_1.ServiceHelper();
        this.classSessionId = '';
        this.loaded = 0;
        this.toLoad = 4;
        this.sessionMedias = [];
        this.sessionMediaTypes = [];
        this.sessionDocuments = [];
        this.currentUrl = window.location.href;
        this.sessionMediaFormSubmitted = false;
    }
    Object.defineProperty(ClassSessionsMaterialComponent.prototype, "sessionMediaFormControls", {
        get: function () { return this.sessionMediaForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    ClassSessionsMaterialComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    ClassSessionsMaterialComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        $('.myClass').removeClass('my-dialog');
        if (this.selectedTutorId && this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getCompanyTutorData(this.selectedTutorId)
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
            }, function (error) {
            });
        }
        else if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
            }, function (error) {
            });
        }
        else {
            this.classSessionId = classSessionId;
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
            }, function (error) {
            });
        }
        this.enumsService.get('SessionMediaType')
            .subscribe(function (success) {
            _this.sessionMediaTypes = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.classSessionsService.getById(this.classSessionId)
            .subscribe(function (success) {
            _this.classSession = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.loadSessionMedia();
        this.resetSessionMediaForm();
        //To get subscription
        if (!this.selectedTutorId) {
            this.tutorsService.getSubScriptionFeatureByTutor().subscribe(function (res) {
                debugger;
                _this.ProfileApproval = res.adminDashboard_ProfileApproval_ApprovalRequired;
            }, function (err) { });
        }
    };
    ClassSessionsMaterialComponent.prototype.loadSessionMedia = function () {
        var _this = this;
        this.sessionMediasService.getByClassSession(this.classSessionId)
            .subscribe(function (success) {
            _this.sessionMedias = success;
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    ClassSessionsMaterialComponent.prototype.resetSessionMediaForm = function () {
        this.sessionMediaFormSubmitted = false;
        this.sessionMediaForm = this.fb.group({
            classSessionId: [this.classSessionId],
            name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            content: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(2000)]],
            type: [null, [forms_1.Validators.required]],
        });
    };
    ;
    ClassSessionsMaterialComponent.prototype.submitSessionMediaForm = function () {
        var _this = this;
        this.sessionMediaFormSubmitted = true;
        if (this.sessionMediaForm.valid) {
            $('.loading').show();
            this.sessionMediasService.create(this.sessionMediaForm.getRawValue())
                .subscribe(function (success) {
                _this.loadSessionMedia();
                _this.resetSessionMediaForm();
                $('.loading').hide();
            }, function (error) {
            });
        }
    };
    ;
    ClassSessionsMaterialComponent.prototype.deleteSessionMedia = function (sessionMedia) {
        var _this = this;
        $('.loading').show();
        this.sessionMediasService.delete(sessionMedia.sessionMediaId)
            .subscribe(function (success) {
            _this.loadSessionMedia();
            $('.loading').hide();
        }, function (error) {
        });
    };
    ;
    ClassSessionsMaterialComponent.prototype.ngAfterViewChecked = function () {
        if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.selectedTutorId = this.selectedTutorId;
        }
        else {
            this.classSessionId = classSessionId;
        }
    };
    ClassSessionsMaterialComponent.prototype.closeLessonDialogs = function () {
        this.dialogRef.close();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsMaterialComponent.prototype, "classSessionIdDialog", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsMaterialComponent.prototype, "selectedTutorId", void 0);
    ClassSessionsMaterialComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-material',
            templateUrl: './class-sessions-material.component.html',
            styleUrls: ['./class-sessions-material.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.SessionMediasService, services_1.EnumsService, services_1.ClassSessionsService, services_1.CompanyService])
    ], ClassSessionsMaterialComponent);
    return ClassSessionsMaterialComponent;
}());
exports.ClassSessionsMaterialComponent = ClassSessionsMaterialComponent;
//# sourceMappingURL=class-sessions-material.component.js.map