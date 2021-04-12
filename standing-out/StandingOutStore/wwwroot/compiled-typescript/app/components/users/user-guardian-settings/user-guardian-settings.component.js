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
exports.UserGuardianSettingsComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var tick_modal_1 = require("../../../partials/tick-modal/tick-modal");
var UserGuardianSettingsComponent = /** @class */ (function () {
    function UserGuardianSettingsComponent(usersService, formBuilder, modalService) {
        this.usersService = usersService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.title = title;
        this.user = null;
    }
    Object.defineProperty(UserGuardianSettingsComponent.prototype, "userFormControls", {
        get: function () { return this.userForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    UserGuardianSettingsComponent.prototype.getUser = function () {
        var _this = this;
        this.usersService.getMyGuardian()
            .subscribe(function (success) {
            _this.user = success;
            console.log(_this.user);
            _this.setupUserForm(_this.user);
        }, function (error) {
            console.log(error);
        });
    };
    ;
    UserGuardianSettingsComponent.prototype.setupUserForm = function (user) {
        this.userForm = this.formBuilder.group({
            firstName: [user.firstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            lastName: [user.lastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [forms_1.Validators.maxLength(250), forms_1.Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            childFirstName: [user.childFirstName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            childLastName: [user.childLastName, [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            childDateOfBirth: [{ value: user.childDateOfBirth, disabled: true }],
            childDateOfBirthDay: [{ value: new Date(user.childDateOfBirth).getDate(), disabled: true }],
            childDateOfBirthMonth: [{ value: new Date(user.childDateOfBirth).getMonth() + 1, disabled: true }],
            childDateOfBirthYear: [{ value: new Date(user.childDateOfBirth).getFullYear(), disabled: true }],
        });
    };
    ;
    UserGuardianSettingsComponent.prototype.submitUserForm = function () {
        var _this = this;
        this.userFormSubmitted = true;
        if (this.userForm.valid) {
            this.usersService.updateGuardianSettings(this.userForm.value)
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
    UserGuardianSettingsComponent.prototype.back = function () {
        window.location.href = '/my/timetable';
    };
    ;
    UserGuardianSettingsComponent.prototype.ngOnInit = function () {
        this.getUser();
    };
    ;
    UserGuardianSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-user-guardian-settings',
            templateUrl: './user-guardian-settings.component.html'
        }),
        __metadata("design:paramtypes", [index_1.UsersService, forms_1.FormBuilder,
            ng_bootstrap_1.NgbModal])
    ], UserGuardianSettingsComponent);
    return UserGuardianSettingsComponent;
}());
exports.UserGuardianSettingsComponent = UserGuardianSettingsComponent;
//# sourceMappingURL=user-guardian-settings.component.js.map