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
exports.UsersIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var dialog_1 = require("@angular/material/dialog");
var UsersIndexComponent = /** @class */ (function () {
    function UsersIndexComponent(usersService, dialog, dialogRef) {
        this.usersService = usersService;
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.title = title;
        this.userType = userType;
        this.area = area;
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
            sortType: 'Email',
            order: 'ASC',
            filter: '',
        };
        this.results = { paged: null, data: null };
    }
    UsersIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getUsers();
    };
    ;
    UsersIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getUsers();
    };
    ;
    UsersIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getUsers();
    };
    ;
    UsersIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getUsers();
    };
    ;
    UsersIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    UsersIndexComponent.prototype.getUsers = function () {
        var _this = this;
        $('.loading').show();
        if (this.userType == 'Student') {
            this.usersService.getStudentsPaged(this.searchModel)
                .subscribe(function (success) {
                _this.results = success;
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
                $('.loading').hide();
            }, function (error) {
                console.log(error);
            });
        }
        else if (this.userType == 'Admin') {
            this.usersService.getAdminsPaged(this.searchModel)
                .subscribe(function (success) {
                _this.results = success;
                console.log("admins:", _this.results);
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
                $('.loading').hide();
            }, function (error) {
                console.log(error);
            });
        }
        else if (this.userType == 'Super Admin') {
            this.usersService.getAdminsPaged(this.searchModel)
                .subscribe(function (success) {
                _this.results = success;
                console.log("admins:", _this.results);
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
                $('.loading').hide();
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    UsersIndexComponent.prototype.ngOnInit = function () {
        this.getUsers();
    };
    ;
    UsersIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    UsersIndexComponent.prototype.showStudentInfoBox = function (templateRef) {
        this.dialogRef = this.dialog.open(templateRef, {
            maxWidth: '60vw',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'id': ''
            }
        });
        this.dialogRef.afterClosed().subscribe(function (result) {
            console.log("Dialog result: " + result); // Pizza!
        });
    };
    UsersIndexComponent.prototype.hideStudnetBox = function () {
        this.dialog.closeAll();
    };
    UsersIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-users-index',
            templateUrl: './users-index.component.html',
            styleUrls: ['./users-index.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.UsersService, dialog_1.MatDialog, dialog_1.MatDialogRef])
    ], UsersIndexComponent);
    return UsersIndexComponent;
}());
exports.UsersIndexComponent = UsersIndexComponent;
//# sourceMappingURL=users-index.component.js.map