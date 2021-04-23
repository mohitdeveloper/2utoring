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
exports.SubjectStudyLevelSetupIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var subject_studylevel_create_dialog_component_1 = require("../subject-studylevel-create-dialog/subject-studylevel-create-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var subject_studylevel_delete_dialog_component_1 = require("../subject-studylevel-delete-dialog.component");
var ngx_toastr_1 = require("ngx-toastr");
var subject_studylevel_info_dialog_component_1 = require("../subject-studylevel-info-dialog/subject-studylevel-info-dialog.component");
var SubjectStudyLevelSetupIndexComponent = /** @class */ (function () {
    function SubjectStudyLevelSetupIndexComponent(subjectStudyLevelSetupService, dialog, toastr, usersService, stripeCountrysService) {
        this.subjectStudyLevelSetupService = subjectStudyLevelSetupService;
        this.dialog = dialog;
        this.toastr = toastr;
        this.usersService = usersService;
        this.stripeCountrysService = stripeCountrysService;
        this.tutorId = null;
        this.colMdLg = 6;
        this.isFilterVisible = 1;
        this.stripeCountry = stripeCountry;
        this.title = title;
        this.alertMessage = null;
        this.takeValues = [
            { take: 10, name: 'Show 10' },
            { take: 25, name: 'Show 25' },
            { take: 50, name: 'Show 50' },
            { take: 100, name: 'Show 100' }
        ];
        this.searchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'Subject.Name',
            order: 'ASC',
            filter: '',
            owningEntityId: '',
            subjectStudyLevelSetupType: index_1.SubjectStudyLevelSetupType.Company,
            subjectNameSearch: '',
            studyLevelSearch: '',
        };
        this.results = { paged: null, data: null };
        //if (this.tutorId == null) {
        //    this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || this.tutorId;
        //    this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || 'Tutor';
        //    this.searchModel.subjectStudyLevelSetupType =
        //        (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
        //            SubjectStudyLevelSetupType.Tutor : SubjectStudyLevelSetupType.Company;
        //    this.searchModel.owningEntityId = this.owningEntityId;
        //}
    }
    SubjectStudyLevelSetupIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getSubjectStudyLevelSetupData();
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getSubjectStudyLevelSetupData();
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getSubjectStudyLevelSetupData();
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getSubjectStudyLevelSetupData();
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    SubjectStudyLevelSetupIndexComponent.prototype.getSubjectStudyLevelSetupData = function () {
        var _this = this;
        $('.loading').show();
        this.subjectStudyLevelSetupService.getPaged(this.searchModel)
            .subscribe(function (success) {
            _this.results = success;
            var innerWidth = window.innerWidth;
            if (innerWidth > 967) {
                if (environment_1.environment.indexPageAnchoringEnabled == true) {
                    if (environment_1.environment.smoothScroll == false) {
                        //quick and snappy
                        window.scroll(0, 0);
                    }
                    else {
                        window.scroll({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            }
            $('.loading').hide();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.ngOnInit = function () {
        var _this = this;
        debugger;
        this.getUserAlertMessage();
        this.subjectStudyLevelSetupService.getUserType()
            .subscribe(function (success) {
            _this.userType = success;
        }, function (error) {
        });
        if (this.ownerEntityId || this.ownerEntityType) {
            if (this.ownerRegisterTitle) {
                this.colMdLg = 4;
                this.title = 'Price Setup';
            }
            this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || this.ownerEntityId;
            this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || this.ownerEntityType;
            this.searchModel.subjectStudyLevelSetupType =
                (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
                    index_1.SubjectStudyLevelSetupType.Tutor : index_1.SubjectStudyLevelSetupType.Company;
            this.searchModel.owningEntityId = this.owningEntityId;
        }
        else {
            this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || null;
            this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || null;
            debugger;
            this.searchModel.subjectStudyLevelSetupType =
                (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
                    index_1.SubjectStudyLevelSetupType.Tutor : index_1.SubjectStudyLevelSetupType.Company;
            this.searchModel.owningEntityId = this.owningEntityId;
        }
        this.getSubjectStudyLevelSetupData();
        if (this.stripeCountry.currencySymbol == null) {
            this.stripeCountrysService.getMyStripeCountry()
                .subscribe(function (success) {
                debugger;
                _this.stripeCountry = success;
            }, function (error) {
            });
        }
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    //to open popup window add subject price
    SubjectStudyLevelSetupIndexComponent.prototype.addPriceForSubjects = function () {
        var _this = this;
        var dialogRef = this.dialog.open(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'id': ''
            }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.getSubjectStudyLevelSetupData();
            }
        });
    };
    //to open popup window update subject price
    SubjectStudyLevelSetupIndexComponent.prototype.updateSubjectPrice = function (subjectPriceId, allowEdit) {
        var _this = this;
        debugger;
        var dialogRef = this.dialog.open(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent, {
            //maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            //panelClass: 'my-dialog',
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'id': subjectPriceId ? subjectPriceId : '',
                'allowEdit': allowEdit,
                'userType': this.userType
            }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.getSubjectStudyLevelSetupData();
            }
        });
    };
    //delete subject price 
    SubjectStudyLevelSetupIndexComponent.prototype.deleteSubjectPrice = function (subjectPriceId) {
        var _this = this;
        var dialogRef = this.dialog.open(subject_studylevel_delete_dialog_component_1.subjectStudyLevelDeleteDialog, {
            data: {
                'id': subjectPriceId ? subjectPriceId : ''
            }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                $('.loading').show();
                _this.subjectStudyLevelSetupService.delete(subjectPriceId)
                    .subscribe(function (success) {
                    $('.loading').hide();
                    _this.getSubjectStudyLevelSetupData();
                    _this.toastr.success('Price delete successfully!');
                }, function (error) {
                });
            }
            else {
                _this.getSubjectStudyLevelSetupData();
            }
        });
    };
    SubjectStudyLevelSetupIndexComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
            _this.isRegistrationDone = success.initialRegistrationComplete;
        }, function (error) {
        });
    };
    SubjectStudyLevelSetupIndexComponent.prototype.showSubjectStudyLevelInfoBox = function () {
        var _this = this;
        //to open popup window add subject price
        var dialogRef = this.dialog.open(subject_studylevel_info_dialog_component_1.SubjectStudylevelInfoDialogComponent, {
            maxWidth: '60vw',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'userType': this.userType,
                'isFilterVisible': this.isFilterVisible,
            }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.getSubjectStudyLevelSetupData();
            }
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SubjectStudyLevelSetupIndexComponent.prototype, "ownerEntityId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SubjectStudyLevelSetupIndexComponent.prototype, "ownerEntityType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SubjectStudyLevelSetupIndexComponent.prototype, "ownerRegisterTitle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SubjectStudyLevelSetupIndexComponent.prototype, "isFilterVisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SubjectStudyLevelSetupIndexComponent.prototype, "isRegistrationDone", void 0);
    SubjectStudyLevelSetupIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-subject-studylevel-setup-index',
            templateUrl: './subject-studylevel-setup-index.component.html',
            styleUrls: ['./subject-studylevel-setup-index.component.css'],
        })
        // TODO - Continue here 25 Aug 2020...
        ,
        __metadata("design:paramtypes", [index_2.SubjectStudyLevelSetupService, dialog_1.MatDialog, ngx_toastr_1.ToastrService, index_2.UsersService, index_2.StripeCountrysService])
    ], SubjectStudyLevelSetupIndexComponent);
    return SubjectStudyLevelSetupIndexComponent;
}());
exports.SubjectStudyLevelSetupIndexComponent = SubjectStudyLevelSetupIndexComponent;
//# sourceMappingURL=subject-studylevel-setup-index.component.js.map