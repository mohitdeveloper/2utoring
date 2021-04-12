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
exports.UserChangePasswordComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var UserChangePasswordComponent = /** @class */ (function () {
    function UserChangePasswordComponent(usersService, formBuilder, toastr) {
        this.usersService = usersService;
        this.formBuilder = formBuilder;
        this.toastr = toastr;
    }
    Object.defineProperty(UserChangePasswordComponent.prototype, "passwordFormControls", {
        get: function () { return this.passwordForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    UserChangePasswordComponent.prototype.ngOnInit = function () {
        this.setupPasswordForm();
    };
    UserChangePasswordComponent.prototype.setupPasswordForm = function () {
        this.passwordFormSubmitted = false;
        this.passwordForm = this.formBuilder.group({
            oldPassword: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
            confirmPassword: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250), forms_1.Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
        });
    };
    ;
    UserChangePasswordComponent.prototype.submitPasswordForm = function () {
        var _this = this;
        this.passwordFormSubmitted = true;
        if (this.passwordForm.value.password == this.passwordForm.value.confirmPassword && this.passwordForm.valid) {
            $('.loading').show();
            this.usersService.changePassword(this.passwordForm.value)
                .subscribe(function (success) {
                if (success == true) {
                    _this.toastr.success('Password change successfull', 'Success');
                    _this.setupPasswordForm();
                    $('.loading').hide();
                }
                else {
                    _this.toastr.error('The old password entered was incorrect', 'Error');
                    $('.loading').hide();
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    UserChangePasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-user-change-password',
            templateUrl: './user-change-password.component.html',
            styleUrls: ['./user-change-password.component.css']
        }),
        __metadata("design:paramtypes", [index_1.UsersService, forms_1.FormBuilder, ngx_toastr_1.ToastrService])
    ], UserChangePasswordComponent);
    return UserChangePasswordComponent;
}());
exports.UserChangePasswordComponent = UserChangePasswordComponent;
//# sourceMappingURL=user-change-password.component.js.map