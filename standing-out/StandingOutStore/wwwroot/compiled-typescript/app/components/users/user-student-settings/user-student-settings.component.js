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
exports.UserStudentSettingsComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var tick_modal_1 = require("../../../partials/tick-modal/tick-modal");
var UserStudentSettingsComponent = /** @class */ (function () {
    function UserStudentSettingsComponent(usersService, formBuilder, modalService) {
        this.usersService = usersService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.title = title;
        this.user = null;
    }
    Object.defineProperty(UserStudentSettingsComponent.prototype, "userFormControls", {
        get: function () { return this.userForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    UserStudentSettingsComponent.prototype.getUser = function () {
        var _this = this;
        this.usersService.getMy()
            .subscribe(function (success) {
            _this.user = success;
            _this.setupUserForm(_this.user);
        }, function (error) {
            console.log(error);
        });
    };
    ;
    UserStudentSettingsComponent.prototype.setupUserForm = function (user) {
        this.userForm = this.formBuilder.group({
            firstName: [user.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            lastName: [user.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            dateOfBirth: [{ value: user.dateOfBirth, disabled: true }],
            telephoneNumber: [user.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            dateOfBirthDay: [{ value: new Date(user.dateOfBirth).getDate(), disabled: true }],
            dateOfBirthMonth: [{ value: new Date(user.dateOfBirth).getMonth() + 1, disabled: true }],
            dateOfBirthYear: [{ value: new Date(user.dateOfBirth).getFullYear(), disabled: true }],
        });
    };
    ;
    UserStudentSettingsComponent.prototype.submitUserForm = function () {
        var _this = this;
        this.userFormSubmitted = true;
        if (this.userForm.valid) {
            this.usersService.updateStudentSettings(this.userForm.value)
                .subscribe(function (success) {
                _this.user = success;
                var navTo = '/my/timetable';
                var modalRef = _this.modalService.open(tick_modal_1.TickModal, { size: 'md' });
                modalRef.componentInstance.title = 'Settings updated!';
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
    UserStudentSettingsComponent.prototype.ngOnInit = function () {
        this.getUser();
    };
    ;
    UserStudentSettingsComponent.prototype.back = function () {
        window.location.href = '/my/timetable';
    };
    ;
    UserStudentSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-user-student-settings',
            templateUrl: './user-student-settings.component.html'
        }),
        __metadata("design:paramtypes", [index_1.UsersService, forms_1.FormBuilder,
            ng_bootstrap_1.NgbModal])
    ], UserStudentSettingsComponent);
    return UserStudentSettingsComponent;
}());
exports.UserStudentSettingsComponent = UserStudentSettingsComponent;
//# sourceMappingURL=user-student-settings.component.js.map