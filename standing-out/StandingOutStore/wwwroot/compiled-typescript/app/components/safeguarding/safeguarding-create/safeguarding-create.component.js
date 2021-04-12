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
exports.SafeguardingCreateComponent = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var forms_1 = require("@angular/forms");
var index_1 = require("../../../services/index");
var tick_modal_1 = require("../../../partials/tick-modal/tick-modal");
var SafeguardingCreateComponent = /** @class */ (function () {
    function SafeguardingCreateComponent(formBuilder, classSessionsService, safeguardingReportsService, modalService) {
        this.formBuilder = formBuilder;
        this.classSessionsService = classSessionsService;
        this.safeguardingReportsService = safeguardingReportsService;
        this.modalService = modalService;
        this.lessons = [];
        this.reportFormSubmitted = false;
    }
    Object.defineProperty(SafeguardingCreateComponent.prototype, "reportFormControls", {
        get: function () { return this.reportForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    SafeguardingCreateComponent.prototype.send = function () {
        var _this = this;
        this.reportFormSubmitted = true;
        if (this.reportForm.valid) {
            this.safeguardingReportsService.create(this.reportForm.value)
                .subscribe(function (success) {
                var navTo = '/my/timetable';
                var modalRef = _this.modalService.open(tick_modal_1.TickModal, { size: 'md' });
                modalRef.componentInstance.title = 'We\'ve recieved your report';
                modalRef.componentInstance.navTo = navTo;
                modalRef.componentInstance.button = 'Back to timetable';
                //handle the response
                modalRef.result.then(function (result) {
                }, function (reason) {
                    window.location.href = navTo;
                });
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    SafeguardingCreateComponent.prototype.close = function () {
        window.location.href = '/my/timetable';
    };
    ;
    SafeguardingCreateComponent.prototype.getLessons = function () {
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
    SafeguardingCreateComponent.prototype.setupReportForm = function () {
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
    SafeguardingCreateComponent.prototype.ngOnInit = function () {
        this.getLessons();
    };
    ;
    SafeguardingCreateComponent = __decorate([
        core_1.Component({
            selector: 'app-safeguarding-create',
            templateUrl: './safeguarding-create.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, index_1.ClassSessionsService,
            index_1.SafeguardingReportsService, ng_bootstrap_1.NgbModal])
    ], SafeguardingCreateComponent);
    return SafeguardingCreateComponent;
}());
exports.SafeguardingCreateComponent = SafeguardingCreateComponent;
//# sourceMappingURL=safeguarding-create.component.js.map