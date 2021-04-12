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
exports.TutorProfileEditComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var ng2_file_upload_1 = require("ng2-file-upload");
var helpers_1 = require("../../../helpers");
var ngx_toastr_1 = require("ngx-toastr");
var $ = require("jquery");
var calender_component_1 = require("../../calender/calender.component");
var angular_cropperjs_1 = require("angular-cropperjs");
var platform_browser_1 = require("@angular/platform-browser");
var TutorProfileEditComponent = /** @class */ (function () {
    function TutorProfileEditComponent(fb, toastr, tutorsService, tutorQualificationsService, tutorCertificatesService, tutorSubjectsService, subjectsService, subjectCategoriesService, studyLevelsService, sanitizer) {
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.tutorQualificationsService = tutorQualificationsService;
        this.tutorCertificatesService = tutorCertificatesService;
        this.tutorSubjectsService = tutorSubjectsService;
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.sanitizer = sanitizer;
        this.serviceHelper = new helpers_1.ServiceHelper();
        this.loaded = 0;
        this.toLoad = 5;
        this.tutorQualifications = [];
        this.tutorSubjects = [];
        this.profileThreeUploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + '/api/tutors/profileUpload', method: 'POST' });
        this.profileThreeDropZoneOver = false;
        this.profileThreeUploaderShow = true;
        this.profileFormSubmitted = false;
        this.qualificationFormSubmitted = false;
        this.qualificationFormUploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + '/api/tutorCertificates/upload', method: 'POST' });
        this.qualificationFormDropZoneOver = false;
        this.qualificationFormUploaderShow = true;
        this.tutorCertificates = [];
        this.subjectFormSubmitted = false;
        this.subjects = [];
        this.subjectCategorys = [];
        this.profileThreeUploaderPreviewUrl = '';
        this.config = {
            aspectRatio: 16 / 16,
            dragMode: 'move',
            background: true,
            movable: true,
            rotatable: true,
            scalable: true,
            zoomable: true,
            viewMode: 1,
            checkImageOrigin: true,
            cropmove: this.cropMoved.bind(this),
            ready: this.cropMoved.bind(this),
            checkCrossOrigin: true
        };
    }
    Object.defineProperty(TutorProfileEditComponent.prototype, "profileFormControls", {
        get: function () { return this.profileForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorProfileEditComponent.prototype, "qualificationFormControls", {
        get: function () { return this.qualificationForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorProfileEditComponent.prototype, "subjectFormControls", {
        get: function () { return this.subjectForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TutorProfileEditComponent.prototype, "tutorSubjectStudyLevelsFormArrayControls", {
        get: function () { return this.subjectForm.get('tutorSubjectStudyLevels'); },
        enumerable: false,
        configurable: true
    });
    TutorProfileEditComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    TutorProfileEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.tutorId);
        $('.loading').show();
        this.tutorsService.getAvailability(this.tutorId).subscribe(function (respt) {
            _this.registerdEvents = respt;
        }, function (error) {
        });
        this.tutorsService.getById(this.tutorId)
            .subscribe(function (success) {
            _this.tutor = success;
            _this.profileForm = _this.fb.group({
                tutorId: [success.tutorId],
                userFirstName: [success.userFirstName],
                header: [success.header, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                subHeader: [success.subHeader, [forms_1.Validators.maxLength(2000)]],
                biography: [success.biography, [forms_1.Validators.maxLength(2000)]],
                profileTeachingExperiance: [success.profileTeachingExperiance, [forms_1.Validators.maxLength(2000)]],
                profileHowITeach: [success.profileHowITeach, [forms_1.Validators.maxLength(2000)]],
            });
            _this.incrementLoad();
        }, function (error) {
        });
        this.resetQualificationForm();
        this.resetSubjectForm();
        this.subjectsService.getOptions()
            .subscribe(function (success) {
            _this.subjects = success;
            _this.incrementLoad();
        }, function (error) {
            _this.subjects = [];
        });
        this.subjectCategoriesService.getOptions()
            .subscribe(function (success) {
            _this.subjectCategorys = success;
            _this.incrementLoad();
        }, function (error) {
            _this.subjectCategorys = [];
        });
        this.tutorsService.getBookedSlot(this.tutorId)
            .subscribe(function (success) {
            _this.bookedSlot = success;
            debugger;
        }, function (error) {
        });
        this.tutorCertificatesService.getByTutor(this.tutorId)
            .subscribe(function (success) {
            _this.tutorCertificates = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    TutorProfileEditComponent.prototype.fileOverProfileThreeUploader = function (e) {
        this.profileThreeDropZoneOver = e;
    };
    TutorProfileEditComponent.prototype.profileThreeUploaderFileDropped = function (e) {
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/
        var index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
    };
    TutorProfileEditComponent.prototype.uploadProfileImage = function () {
        var _this = this;
        if (this.profileThreeUploader.queue.length > 0) {
            $('.loading').show();
            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;
            this.profileThreeUploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.profileThreeUploader.clearQueue();
                    _this.profileThreeUploaderShow = true;
                    _this.tutorsService.getById(_this.tutorId)
                        .subscribe(function (success) {
                        _this.tutor = success;
                        $('.loading').hide();
                    }, function (error) {
                    });
                }
                else {
                    $('.loading').hide();
                    _this.profileThreeUploader.clearQueue();
                    _this.profileThreeUploaderShow = true;
                    _this.toastr.error('We were unable to upload your profile picture');
                }
            };
        }
    };
    TutorProfileEditComponent.prototype.submitProfileForm = function () {
        var _this = this;
        debugger;
        this.profileFormSubmitted = true;
        if (this.profileForm.valid) {
            $('.loading').show();
            this.tutorsService.saveProfile(this.profileForm.getRawValue())
                .subscribe(function (success) {
                $('.loading').hide();
                _this.uploadProfileImage();
                window.location.href = "/Tutor/Profile/View";
            }, function (error) {
            });
            //let obj = this.calendarRef.addedEvents;
            //if (this.calendarRef.deletedEvents.length > 0) {
            //    Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
            //}
            //this.tutorsService.saveAvailability(obj).subscribe(success => {
            //    $('.loading').hide();
            //}, error => {
            //        $('.loading').hide();
            //});
        }
    };
    ;
    TutorProfileEditComponent.prototype.resetQualificationForm = function () {
        var _this = this;
        this.tutorQualificationsService.getByTutor(this.tutorId)
            .subscribe(function (success) {
            _this.tutorQualifications = success;
            _this.qualificationFormSubmitted = false;
            _this.qualificationForm = _this.fb.group({
                tutorId: [_this.tutorId],
                name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            });
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    TutorProfileEditComponent.prototype.submitQualificationForm = function () {
        var _this = this;
        this.qualificationFormSubmitted = true;
        if (this.qualificationForm.valid) {
            $('.loading').show();
            this.tutorQualificationsService.create(this.qualificationForm.getRawValue())
                .subscribe(function (success) {
                _this.resetQualificationForm();
            }, function (error) {
            });
        }
    };
    ;
    TutorProfileEditComponent.prototype.deleteTutorQualification = function (tutorQualification) {
        var _this = this;
        $('.loading').show();
        this.tutorQualificationsService.delete(tutorQualification.tutorQualificationId)
            .subscribe(function (success) {
            _this.tutorQualificationsService.getByTutor(_this.tutorId)
                .subscribe(function (success) {
                _this.tutorQualifications = success;
                $('.loading').hide();
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    TutorProfileEditComponent.prototype.fileOverQualificationFormUploader = function (e) {
        this.qualificationFormDropZoneOver = e;
    };
    TutorProfileEditComponent.prototype.qualificationFormUploaderFileDropped = function (e) {
        var _this = this;
        console.log(this.qualificationFormUploader.queue);
        if (this.qualificationFormUploader.queue.length > 0) {
            $('.loading').show();
            this.qualificationFormUploader.uploadAll();
            this.qualificationFormUploaderShow = false;
            this.qualificationFormUploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.qualificationFormUploader.clearQueue();
                    _this.qualificationFormUploaderShow = true;
                    _this.tutorCertificatesService.getByTutor(_this.tutorId)
                        .subscribe(function (success) {
                        _this.tutorCertificates = success;
                        $('.loading').hide();
                    }, function (error) {
                    });
                }
                else {
                    $('.loading').hide();
                    _this.qualificationFormUploader.clearQueue();
                    _this.qualificationFormUploaderShow = true;
                    _this.toastr.error('We were unable to upload your document');
                }
            };
        }
    };
    TutorProfileEditComponent.prototype.deleteTutorCertificate = function (tutorCertificate) {
        var _this = this;
        $('.loading').show();
        this.tutorCertificatesService.delete(tutorCertificate.tutorCertificateId)
            .subscribe(function (success) {
            _this.tutorCertificatesService.getByTutor(_this.tutorId)
                .subscribe(function (success) {
                _this.tutorCertificates = success;
                $('.loading').hide();
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    TutorProfileEditComponent.prototype.resetSubjectForm = function () {
        var _this = this;
        this.tutorSubjectsService.getByTutor(this.tutorId)
            .subscribe(function (success) {
            _this.tutorSubjects = success;
            _this.subjectFormSubmitted = false;
            _this.subjectForm = _this.fb.group({
                tutorId: [_this.tutorId],
                subjectId: [null, [forms_1.Validators.required]],
                subjectCategoryId: [null, []],
                tutorSubjectStudyLevels: _this.fb.array([])
            });
            _this.studyLevelsService.getOptions()
                .subscribe(function (studyLevelsSuccess) {
                for (var i = 0; i < studyLevelsSuccess.length; i++) {
                    var tutorSubjectStudyLevel = _this.fb.group({
                        studyLevelId: [studyLevelsSuccess[i].id, []],
                        name: [studyLevelsSuccess[i].name, []],
                        checked: [false, []],
                    });
                    _this.tutorSubjectStudyLevelsFormArrayControls.push(tutorSubjectStudyLevel);
                }
            }, function (error) {
            });
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    TutorProfileEditComponent.prototype.getSubjectCategorys = function () {
        var _this = this;
        if (this.subjectForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.subjectForm.get('subjectId').value)
                .subscribe(function (success) {
                _this.subjectCategorys = success;
                $('.loading').hide();
            }, function (error) {
            });
        }
    };
    ;
    TutorProfileEditComponent.prototype.submitSubjectForm = function () {
        var _this = this;
        this.subjectFormSubmitted = true;
        if (this.subjectForm.valid) {
            if (this.tutorSubjectStudyLevelsFormArrayControls.value.filter(function (u) { return u.checked == true; }).length > 0) {
                $('.loading').show();
                this.tutorSubjectsService.create(this.subjectForm.getRawValue())
                    .subscribe(function (success) {
                    _this.resetSubjectForm();
                }, function (error) {
                });
            }
            else {
                this.toastr.error('Please select at least 1 level to save a subject');
            }
        }
    };
    ;
    TutorProfileEditComponent.prototype.deleteTutorSubject = function (tutorSubject) {
        var _this = this;
        $('.loading').show();
        this.tutorSubjectsService.delete(tutorSubject.tutorSubjectId)
            .subscribe(function (success) {
            _this.resetSubjectForm();
        }, function (error) {
        });
    };
    ;
    TutorProfileEditComponent.prototype.cropMoved = function (data) {
        var _this = this;
        debugger;
        var canvas = this.angularCropper.cropper.getCroppedCanvas({
            width: 170,
            height: 170,
        });
        this.tutor.storeProfileImageDownload = canvas.toDataURL();
        canvas.toBlob(function (blob) {
            debugger;
            blob['name'] = 'myfilename.png';
            /*if (this.profileThreeUploader.queue.length > 1) {
                this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
            }*/
            // this.croppedProfileImage = blob;
            _this.profileThreeUploader.clearQueue();
            _this.profileThreeUploader.addToQueue([blob]);
        });
        $('.cropper img').show();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TutorProfileEditComponent.prototype, "tutorId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TutorProfileEditComponent.prototype, "showEditButton", void 0);
    __decorate([
        core_1.ViewChild('calendarRef'),
        __metadata("design:type", calender_component_1.CalenderComponent)
    ], TutorProfileEditComponent.prototype, "calendarRef", void 0);
    __decorate([
        core_1.ViewChild('angularCropper'),
        __metadata("design:type", angular_cropperjs_1.CropperComponent)
    ], TutorProfileEditComponent.prototype, "angularCropper", void 0);
    TutorProfileEditComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-profile-edit',
            templateUrl: './tutor-profile-edit.component.html',
            styleUrls: ['./tutor-profile-edit.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.TutorQualificationsService, services_1.TutorCertificatesService, services_1.TutorSubjectsService, services_1.SubjectsService, services_1.SubjectCategoriesService, services_1.StudyLevelsService, platform_browser_1.DomSanitizer])
    ], TutorProfileEditComponent);
    return TutorProfileEditComponent;
}());
exports.TutorProfileEditComponent = TutorProfileEditComponent;
//# sourceMappingURL=tutor-profile-edit.component.js.map