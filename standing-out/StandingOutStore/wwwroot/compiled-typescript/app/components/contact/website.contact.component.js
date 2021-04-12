"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.WebsiteContactComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../services");
var forms_1 = require("@angular/forms");
var website_contact_service_1 = require("../../services/website-contact.service");
var ngx_toastr_1 = require("ngx-toastr");
var WebsiteContactComponent = /** @class */ (function () {
    function WebsiteContactComponent(toastr, formBuilder, subjectsService, studyLevelsService, websiteCountactService) {
        this.toastr = toastr;
        this.formBuilder = formBuilder;
        this.subjectsService = subjectsService;
        this.studyLevelsService = studyLevelsService;
        this.websiteCountactService = websiteCountactService;
        this.weekDays = [
            { value: 0, name: 'Sunday' },
            { value: 1, name: 'Monday' },
            { value: 2, name: 'Tuesday' },
            { value: 3, name: 'Wednesday' },
            { value: 4, name: 'Thursday' },
            { value: 5, name: 'Friday' },
            { value: 6, name: 'Saturday' }
        ];
        this.selectedDays = [];
    }
    Object.defineProperty(WebsiteContactComponent.prototype, "contactFormControls", {
        get: function () { return this.contactForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    WebsiteContactComponent.prototype.getSubjects = function () {
        var _this = this;
        this.subjectsService.getOptions()
            .subscribe(function (success) {
            _this.subjectList = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    WebsiteContactComponent.prototype.getStudyLevels = function () {
        var _this = this;
        this.studyLevelsService.getOptions()
            .subscribe(function (success) {
            _this.studyLevelList = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    WebsiteContactComponent.prototype.setupContactForm = function () {
        this.contactForm = this.formBuilder.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            contactEmail: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.email]],
            subjectId: ['', [forms_1.Validators.required]],
            studyLevelId: ['', [forms_1.Validators.required]],
            searchFor: ['', [forms_1.Validators.required]],
            time: ['00:00'],
            days: ['', [forms_1.Validators.required]],
            description: ['', [forms_1.Validators.maxLength(2000)]],
        });
    };
    ;
    WebsiteContactComponent.prototype.ngOnInit = function () {
        this.getSubjects();
        this.getStudyLevels();
        this.setupContactForm();
        this.filterTime.nativeElement.value = '00:00';
    };
    ;
    WebsiteContactComponent.prototype.submitContactForm = function () {
        var _this = this;
        debugger;
        console.log(this.contactForm.value);
        this.contactFormSubmitted = true;
        if (this.contactForm.valid) {
            this.websiteCountactService.create(__assign({}, this.contactForm.value))
                .subscribe(function (success) {
                if (success) {
                    _this.toastr.success('Request send successfully!');
                    _this.selectedDays = [];
                    _this.contactForm.reset();
                    _this.contactFormSubmitted = false;
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    WebsiteContactComponent.prototype.getSelectedDays = function ($event) {
        var day = parseInt($event.target.value);
        if ($event.target.checked) {
            this.selectedDays.push(day);
        }
        else {
            this.selectedDays = this.selectedDays.filter(function (a) { return a != day; });
        }
        this.contactForm.controls["days"].setValue(this.selectedDays.join());
        //console.log(this.selectedDays);
    };
    WebsiteContactComponent.prototype.getFilterTime = function () {
        this.contactForm.controls["time"].setValue(this.filterTime.nativeElement.value);
        //console.log(this.filterTime.nativeElement.value);
    };
    __decorate([
        core_1.ViewChild('filterTime'),
        __metadata("design:type", Object)
    ], WebsiteContactComponent.prototype, "filterTime", void 0);
    WebsiteContactComponent = __decorate([
        core_1.Component({
            selector: 'app-website-contact',
            templateUrl: './website.contact.component.html',
            styleUrls: ['./website.contact.component.css']
        }),
        __metadata("design:paramtypes", [ngx_toastr_1.ToastrService, forms_1.FormBuilder, services_1.SubjectsService, services_1.StudyLevelsService, website_contact_service_1.WebsiteContactService])
    ], WebsiteContactComponent);
    return WebsiteContactComponent;
}());
exports.WebsiteContactComponent = WebsiteContactComponent;
//# sourceMappingURL=website.contact.component.js.map