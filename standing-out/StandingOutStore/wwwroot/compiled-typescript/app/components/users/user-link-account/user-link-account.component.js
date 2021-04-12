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
exports.UserLinkAccountComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var UserLinkAccountComponent = /** @class */ (function () {
    function UserLinkAccountComponent(usersService, tutorsService) {
        this.usersService = usersService;
        this.tutorsService = tutorsService;
        this.userLocalLogin = false;
        this.userHasGoogleAccountLinked = false;
        this.currentUrl = window.location.href;
    }
    UserLinkAccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.tutor == true) {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.userLocalLogin = success.localLogin;
                _this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
            }, function (error) {
            });
        }
        else {
            this.usersService.getMy()
                .subscribe(function (success) {
                _this.userLocalLogin = success.localLogin;
                _this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
            }, function (error) {
            });
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], UserLinkAccountComponent.prototype, "tutor", void 0);
    UserLinkAccountComponent = __decorate([
        core_1.Component({
            selector: 'app-user-link-account',
            templateUrl: './user-link-account.component.html',
            styleUrls: ['./user-link-account.component.css']
        }),
        __metadata("design:paramtypes", [index_1.UsersService, index_1.TutorsService])
    ], UserLinkAccountComponent);
    return UserLinkAccountComponent;
}());
exports.UserLinkAccountComponent = UserLinkAccountComponent;
//# sourceMappingURL=user-link-account.component.js.map