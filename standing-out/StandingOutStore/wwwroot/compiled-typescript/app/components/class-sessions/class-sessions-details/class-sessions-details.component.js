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
exports.ClassSessionsDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var models_1 = require("../../../models");
var ngx_toastr_1 = require("ngx-toastr");
var rxjs_1 = require("rxjs");
var ClassSessionsDetailsComponent = /** @class */ (function () {
    function ClassSessionsDetailsComponent(fb, toastr, classSessionsService, tutorsService, enumsService, subjectsService, subjectCategoriesService, studyLevelsService, settingsService, classSessionFeaturesService) {
        var _this = this;
        this.fb = fb;
        this.toastr = toastr;
        this.classSessionsService = classSessionsService;
        this.tutorsService = tutorsService;
        this.enumsService = enumsService;
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.settingsService = settingsService;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.classSessionId = classSessionId;
        this.classSessionComplete = false;
        this.loaded = 0;
        this.toLoad = 7;
        this.subjects = [];
        this.subjectCategorys = [];
        this.studyLevels = [];
        this.types = [];
        this.scheduleTypes = [];
        this.currentUrl = window.location.href;
        this.classSessionFeatures = new models_1.ClassSessionFeatures();
        this.classSessionFormSubmitted = false;
        // usage getClassSessionFeaturesByTutorId.subscribe(features => { // do stuff with features });
        this.getClassSessionFeaturesByTutorId = new rxjs_1.Observable(function (subscriber) {
            //console.log("Getting classroom subscription features..");
            _this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(_this.tutor.tutorId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                _this.classSessionFeatures = features;
                subscriber.next(features);
            }, function (error) { console.log("Could not get classroom subscription features"); });
        });
    }
    Object.defineProperty(ClassSessionsDetailsComponent.prototype, "classSessionFormControls", {
        get: function () { return this.classSessionForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    ClassSessionsDetailsComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    ClassSessionsDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.log("this:", this.tutor);
        $('.loading').show();
        this.subjectsService.getOptions()
            .subscribe(function (success) {
            _this.subjects = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.subjectCategoriesService.getOptions()
            .subscribe(function (success) {
            _this.subjectCategorys = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.studyLevelsService.getOptions()
            .subscribe(function (success) {
            _this.studyLevels = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.enumsService.get('ClassSessionType')
            .subscribe(function (success) {
            //console.log("loaded types");
            _this.types = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.enumsService.get('ClassSessionScheduleType')
            .subscribe(function (success) {
            _this.scheduleTypes = success;
            _this.incrementLoad();
        }, function (error) {
        });
        this.settingsService.getBaseClassSessionCommision()
            .subscribe(function (success) {
            // This commission is no longer valid.. See Subscription Features - Commission Tiers
            _this.baseClassSessionCommision = success;
            //console.log("Settings baseClassSessionCommision:", this.baseClassSessionCommision);
            _this.incrementLoad();
        }, function (error) {
        });
        this.setupClassSessionByMode();
    };
    ClassSessionsDetailsComponent.prototype.setupClassSessionByMode = function () {
        this.isCreateMode() ? this.setupCreateModeClassSession() : this.setupEditModeClassSession();
    };
    // Create mode form
    ClassSessionsDetailsComponent.prototype.setupCreateModeClassSession = function () {
        this.setupClassSessionForm(new models_1.ClassSession());
    };
    // Edit mode form
    ClassSessionsDetailsComponent.prototype.setupEditModeClassSession = function () {
        this.setupExistingClassSession();
    };
    ClassSessionsDetailsComponent.prototype.setupExistingClassSession = function () {
        var _this = this;
        this.classSessionsService.getById(this.classSessionId)
            .subscribe(function (success) {
            _this.classSessionComplete = success.complete;
            _this.classSession = success;
            _this.setupClassSessionForm(success);
        }, function (error) { });
    };
    ClassSessionsDetailsComponent.prototype.isCreateMode = function () {
        return (this.classSessionId == undefined);
    };
    ClassSessionsDetailsComponent.prototype.getClassSizeLimit = function () {
        var classSizeLimit = this.isCreateMode()
            ? this.classSessionFeatures.tutorDashboard_CreateLesson_Session_MaxPersons
            : this.classSessionFeatures.tutorDashboard_EditLesson_Session_MaxPersons;
        return classSizeLimit;
    };
    // should have features available before being called
    ClassSessionsDetailsComponent.prototype.populateForm = function (classSession) {
        this.classSessionFormSubmitted = false;
        if (this.isCreateMode() && this.tutor.localLogin == false) {
            classSession.requiresGoogleAccount = true;
        }
        this.classSessionForm = this.fb.group(this.setupFormControls(classSession));
    };
    ClassSessionsDetailsComponent.prototype.setupFormControls = function (classSession) {
        this.classSizeLimit = this.getClassSizeLimit();
        if (classSession.maxPersons > this.classSizeLimit)
            classSession.maxPersons = this.classSizeLimit;
        //console.log("Setting class size limit:", this.classSizeLimit);
        return {
            classSessionId: [classSession.classSessionId],
            ownerId: [this.tutor.userId],
            requiresGoogleAccount: [{ value: classSession.requiresGoogleAccount, disabled: (this.tutor.localLogin == true || classSession.started == true) }],
            name: [classSession.name, [forms_1.Validators.required, forms_1.Validators.maxLength(40)]],
            subjectId: [classSession.subjectId, [forms_1.Validators.required]],
            subjectCategoryId: [classSession.subjectCategoryId, [forms_1.Validators.required]],
            studyLevelId: [classSession.studyLevelId, [forms_1.Validators.required]],
            maxPersons: [classSession.maxPersons, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(this.classSizeLimit), forms_1.Validators.pattern('^[0-9]+$')]],
            isUnder16: [{ value: classSession.isUnder16, disabled: this.tutor.dbsApprovalStatus != 'Approved' }],
            type: [classSession.type, [forms_1.Validators.required]],
            lessonDescriptionBody: [classSession.lessonDescriptionBody, [forms_1.Validators.required, forms_1.Validators.maxLength(500)]],
            startDate: [classSession.startDate, [forms_1.Validators.required]],
            detailsDuration: [classSession.detailsDuration, [forms_1.Validators.required]],
            scheduleType: [{ value: classSession.scheduleType, disabled: (!this.isCreateMode()) }, [forms_1.Validators.required]],
            scheduleEndDate: [{ value: classSession.scheduleEndDate, disabled: (!this.isCreateMode()) }],
            pricePerPerson: [classSession.pricePerPerson, [forms_1.Validators.required, forms_1.Validators.min(10)]],
        };
    };
    // Gets tutor, then features, then populates form
    ClassSessionsDetailsComponent.prototype.setupClassSessionForm = function (classSession) {
        var _this = this;
        this.tutorsService.getMy()
            .subscribe(function (tutorSuccess) {
            _this.tutor = tutorSuccess;
            _this.setupFeaturesAndPopulateForm(classSession);
            // this.populateForm(classSession);
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    // Needs tutorId before it can be called
    ClassSessionsDetailsComponent.prototype.setupFeaturesAndPopulateForm = function (classSession) {
        var _this = this;
        this.getClassSessionFeaturesByTutorId
            .subscribe(function (features) {
            _this.populateForm(classSession);
            _this.removePrivateLessonType();
        }, function (error) { });
    };
    ClassSessionsDetailsComponent.prototype.getClassSizeEntry = function () {
        var formControls = this.classSessionFormControls;
        return (!isNaN(formControls.maxPersons.value) ?
            formControls.maxPersons.value :
            (!isNaN(this.classSession.maxPersons)) ?
                this.classSession.maxPersons : -1);
    };
    //maxPersonsChanged(): void {
    //    console.log(`Max persons changed...`);
    //    const classSizeEntry = this.getClassSizeEntry();
    //    if (classSizeEntry > 0)
    //        this.setupCommissionFigureByStudentCount(classSizeEntry);
    //}
    ClassSessionsDetailsComponent.prototype.setupCommissionFigureByStudentCount = function (studentCount) {
        // If still using this component, calculate commission using tiered values.
        // const commissionToSet = this.classSessionFeatures.admin_CommissionPerStudent[studentCount - 1];
        //console.log(`Setting student commission for studentCount...${studentCount}  commission:   ${commissionToSet}`);
        this.baseClassSessionCommision = 0; // commissionToSet;
    };
    ClassSessionsDetailsComponent.prototype.getBaseCommissionByContext = function () {
        var calculating = false;
        if (calculating == false) {
            calculating = true;
            var classSizeEntry = this.getClassSizeEntry();
            if (classSizeEntry > 0)
                this.setupCommissionFigureByStudentCount(classSizeEntry);
            calculating = false;
        }
        return this.baseClassSessionCommision;
    };
    ClassSessionsDetailsComponent.prototype.privateLessonCountLimit = function () {
        var privateLessonCount = this.isCreateMode()
            ? this.classSessionFeatures.tutorDashboard_CreateCourse_PrivateLessonCount
            : this.classSessionFeatures.tutorDashboard_EditCourse_PrivateLessonCount;
        //console.log("Private lesson allowed..:", privateLessonAllowed);
        return privateLessonCount;
    };
    ClassSessionsDetailsComponent.prototype.removePrivateLessonType = function () {
        // if (this.isPrivateLessonAllowed()) return;
        var currentTypes = this.types.concat([]);
        var privateLessonOptionIndex = this.findPrivateTypeIndex(currentTypes);
        if (privateLessonOptionIndex < 0)
            return;
        //console.log(`Removing private lesson option from :${currentTypes} at index : ${privateLessonOptionIndex}`);
        currentTypes.splice(privateLessonOptionIndex, 1);
        this.types = currentTypes;
    };
    ClassSessionsDetailsComponent.prototype.findPrivateTypeIndex = function (currentTypes) {
        return currentTypes.findIndex(function (x) { return x.name.toLocaleUpperCase() === "PRIVATE"; });
    };
    ClassSessionsDetailsComponent.prototype.save = function () {
        var _this = this;
        this.classSessionFormSubmitted = true;
        if (this.classSessionForm.valid) {
            $('.loading').show();
            if (!this.isCreateMode()) {
                this.classSessionsService.update(this.classSessionId, this.classSessionForm.getRawValue())
                    .subscribe(function (success) {
                    window.location.href = '/Tutor/ClassSessions/SetupMaterial/' + success.classSessionId;
                }, function (error) {
                    if (error.code == 400) {
                        _this.toastr.error(error.error);
                        $('.loading').hide();
                    }
                    else {
                        _this.toastr.error('Sorry we were unable to update your lesson');
                        $('.loading').hide();
                    }
                });
            }
            else {
                this.classSessionsService.create(this.classSessionForm.getRawValue())
                    .subscribe(function (success) {
                    window.location.href = '/Tutor/ClassSessions/SetupMaterial/' + success.classSessionId;
                }, function (error) {
                    if (error.code == 400) {
                        _this.toastr.error(error.error);
                        $('.loading').hide();
                    }
                    else {
                        _this.toastr.error('Sorry we were unable to create your lesson');
                        $('.loading').hide();
                    }
                });
            }
        }
    };
    ;
    ClassSessionsDetailsComponent.prototype.getSubjectCategorys = function () {
        var _this = this;
        if (this.classSessionForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.classSessionForm.get('subjectId').value)
                .subscribe(function (success) {
                _this.subjectCategorys = success;
                $('.loading').hide();
            }, function (error) {
            });
        }
    };
    ;
    ClassSessionsDetailsComponent.prototype.checkSheduleOver = function () {
        var date = new Date();
        date.setDate(date.getDate() + 60);
        if (this.classSessionForm != undefined && this.classSessionForm.value.scheduleEndDate != null && this.classSessionForm.value.scheduleEndDate != undefined) {
            if (this.classSessionForm.value.scheduleEndDate > date) {
                return true;
            }
        }
        return false;
    };
    ClassSessionsDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-details',
            templateUrl: './class-sessions-details.component.html',
            styleUrls: ['./class-sessions-details.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            ngx_toastr_1.ToastrService,
            services_1.ClassSessionsService,
            services_1.TutorsService,
            services_1.EnumsService,
            services_1.SubjectsService,
            services_1.SubjectCategoriesService,
            services_1.StudyLevelsService,
            services_1.SettingsService,
            services_1.ClassSessionFeaturesService])
    ], ClassSessionsDetailsComponent);
    return ClassSessionsDetailsComponent;
}());
exports.ClassSessionsDetailsComponent = ClassSessionsDetailsComponent;
//# sourceMappingURL=class-sessions-details.component.js.map