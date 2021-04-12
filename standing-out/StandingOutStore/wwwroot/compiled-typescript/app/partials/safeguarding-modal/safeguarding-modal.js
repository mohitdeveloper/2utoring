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
var forms_1 = require("@angular/forms");
var services_1 = require("../../services");
var SafeguardingModal = /** @class */ (function () {
    function SafeguardingModal(activeModal, formBuilder, classSessionsService, safeguardingReportsService) {
        this.activeModal = activeModal;
        this.formBuilder = formBuilder;
        this.classSessionsService = classSessionsService;
        this.safeguardingReportsService = safeguardingReportsService;
        this.lessons = [];
        this.reportFormSubmitted = false;
    }
    Object.defineProperty(SafeguardingModal.prototype, "reportFormControls", {
        get: function () { return this.reportForm.controls; },
        enumerable: true,
        configurable: true
    });
    ;
    SafeguardingModal.prototype.send = function () {
        this.reportFormSubmitted = true;
        if (this.reportForm.valid) {
            this.safeguardingReportsService.create(this.reportForm.value)
                .subscribe(function (success) {
                alert("SUBMITTED");
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    SafeguardingModal.prototype.close = function () {
        this.activeModal.dismiss();
    };
    ;
    SafeguardingModal.prototype.getLessons = function () {
        var _this = this;
        this.classSessionsService.getSafeguardingOptions()
            .subscribe(function (success) {
            _this.lessons = success;
            _this.setupReportForm();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SafeguardingModal.prototype.setupReportForm = function () {
        if (this.lessons.length > 0) {
            this.reportForm = this.formBuilder.group({
                classSessionId: [null, [forms_1.Validators.required]],
                title: [null, [forms_1.Validators.required]],
                description: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(2000)]]
            });
        }
        else {
            this.reportForm = this.formBuilder.group({
                classSessionId: [null, []],
                title: [null, [forms_1.Validators.required]],
                description: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(2000)]]
            });
        }
    };
    ;
    SafeguardingModal.prototype.ngOnInit = function () {
        this.getLessons();
    };
    ;
    SafeguardingModal = __decorate([
        core_1.Component({
            selector: 'app-safeguarding-modal',
            templateUrl: './safeguarding-modal.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, forms_1.FormBuilder,
            services_1.ClassSessionsService, services_1.SafeguardingReportsService])
    ], SafeguardingModal);
    return SafeguardingModal;
}());
exports.SafeguardingModal = SafeguardingModal;
//# sourceMappingURL=safeguarding-modal.js.map