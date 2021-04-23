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
exports.SubjectStudylevelCreateDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var SubjectStudylevelCreateDialogComponent = /** @class */ (function () {
    function SubjectStudylevelCreateDialogComponent(dialogRef, data, fb, StudyLevelsService, subjectService, SubjectStudyLevelSetupService, toastr, stripeCountrysService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.fb = fb;
        this.StudyLevelsService = StudyLevelsService;
        this.subjectService = subjectService;
        this.SubjectStudyLevelSetupService = SubjectStudyLevelSetupService;
        this.toastr = toastr;
        this.stripeCountrysService = stripeCountrysService;
        this.stripeCountry = stripeCountry;
        this.subjectData = [];
        this.StudyLevels = [];
        this.existingLevels = [];
        this.subjectIdOnUpdate = '';
        this.allowEdit = true;
        this.CreateSubjectPriceSubmitted = false;
        this.subjectPriceId = data.id;
        debugger;
        if (data.subjectId) {
            this.selectedSubjectId = data.subjectId;
            this.getStudyLevelsBySubject(data.subjectId);
        }
        if (data.allowEdit == undefined) {
            this.allowEdit = true;
        }
        else {
            this.allowEdit = data.allowEdit;
        }
        this.userType = data.userType;
    }
    Object.defineProperty(SubjectStudylevelCreateDialogComponent.prototype, "CreateSubjectPriceControls", {
        get: function () { return this.CreateSubjectPrice.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    SubjectStudylevelCreateDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getAllSubject();
        this.getStudyLevels();
        if (this.stripeCountry.currencySymbol == null) {
            this.stripeCountrysService.getMyStripeCountry()
                .subscribe(function (success) {
                debugger;
                _this.stripeCountry = success;
            }, function (error) {
            });
        }
        //on edit case
        if (this.subjectPriceId) {
            this.SubjectStudyLevelSetupService.getById(this.subjectPriceId)
                .subscribe(function (success) {
                _this.subjectIdOnUpdate = success.subjectStudyLevelSetupId;
                _this.subjectPriceData = success;
                _this.CreateSubjectPrice.patchValue({
                    subjectId: success.subjectId,
                    studyLevelId: success.studyLevelId,
                    pricePerPerson: success.pricePerPerson,
                    groupPricePerPerson: success.groupPricePerPerson,
                    subjectStudyLevelSetupId: success.subjectStudyLevelSetupId,
                });
                $('.loading').hide();
            }, function (error) {
            });
        }
        this.CreateSubjectPrice = this.fb.group({
            subjectId: ['', [forms_1.Validators.required]],
            studyLevelId: ['', [forms_1.Validators.required]],
            pricePerPerson: ['', [forms_1.Validators.required, forms_1.Validators.min(10), forms_1.Validators.max(999)]],
            groupPricePerPerson: ['', [forms_1.Validators.required, forms_1.Validators.min(10), forms_1.Validators.max(999)]],
            subjectStudyLevelSetupId: [null],
        });
    };
    //get all subjects list
    SubjectStudylevelCreateDialogComponent.prototype.getAllSubject = function () {
        var _this = this;
        this.subjectService.get()
            .subscribe(function (success) {
            _this.subjectData = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    //get all study levels
    SubjectStudylevelCreateDialogComponent.prototype.getStudyLevels = function () {
        var _this = this;
        this.StudyLevelsService.get()
            .subscribe(function (success) {
            _this.StudyLevels = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    SubjectStudylevelCreateDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close(true);
    };
    //submit form
    SubjectStudylevelCreateDialogComponent.prototype.submitCreateSubjectPriceForm = function () {
        var _this = this;
        this.CreateSubjectPriceSubmitted = true;
        if (!this.CreateSubjectPrice.valid) {
            return false;
        }
        $('.loading').show();
        if (this.selectedSubjectId) {
            var priceData = this.CreateSubjectPrice.getRawValue();
            var idx = this.existingLevels.findIndex(function (x) { return x.studyLevelId === priceData.studyLevelId; });
            if (idx != -1 && this.selectedSubjectId == priceData.subjectId) {
                this.toastr.success('Level already associate with selected subject!');
                return false;
            }
        }
        if (this.subjectIdOnUpdate) {
            //this.CreateSubjectPrice.controls["subjectStudyLevelSetupId"].setValue(this.subjectIdOnUpdate);
            this.SubjectStudyLevelSetupService.update(this.CreateSubjectPrice.getRawValue())
                .subscribe(function (success) {
                _this.toastr.success('Price update successfully!');
                $('.loading').hide();
                //this.CompanyCourseForm.reset();
                _this.closeDialog();
            }, function (error) {
                $('.loading').hide();
            });
        }
        else {
            this.SubjectStudyLevelSetupService.create(this.CreateSubjectPrice.getRawValue())
                .subscribe(function (success) {
                _this.toastr.success('Price created successfully!');
                $('.loading').hide();
                //this.CompanyCourseForm.reset();
                _this.closeDialog();
            }, function (error) {
                $('.loading').hide();
            });
        }
    };
    // get level by subject
    SubjectStudylevelCreateDialogComponent.prototype.getStudyLevelsBySubject = function (id) {
        var _this = this;
        this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
            .subscribe(function (success) {
            _this.existingLevels = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    SubjectStudylevelCreateDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-subject-studylevel-create-dialog',
            templateUrl: './subject-studylevel-create-dialog.component.html',
            styleUrls: ['./subject-studylevel-create-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, Object, forms_1.FormBuilder, services_1.StudyLevelsService, services_1.SubjectsService, services_1.SubjectStudyLevelSetupService, ngx_toastr_1.ToastrService, services_1.StripeCountrysService])
    ], SubjectStudylevelCreateDialogComponent);
    return SubjectStudylevelCreateDialogComponent;
}());
exports.SubjectStudylevelCreateDialogComponent = SubjectStudylevelCreateDialogComponent;
//# sourceMappingURL=subject-studylevel-create-dialog.component.js.map