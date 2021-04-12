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
var core_1 = require("@angular/core");
var ngx_toastr_1 = require("ngx-toastr");
var PlaygroundToastrComponent = /** @class */ (function () {
    function PlaygroundToastrComponent(toastr) {
        this.toastr = toastr;
    }
    PlaygroundToastrComponent.prototype.showSuccess = function () {
        this.toastr.success('Emoji War!', '😃😃😃😃😃 Success 😃😃😃😃');
    };
    PlaygroundToastrComponent.prototype.showError = function () {
        this.toastr.error('Error.... Exterminate', 'Error...');
    };
    PlaygroundToastrComponent.prototype.showInfo = function () {
        this.toastr.info('Alien Invasion 90% complete', 'Status Update');
    };
    PlaygroundToastrComponent.prototype.ngOnInit = function () {
    };
    PlaygroundToastrComponent = __decorate([
        core_1.Component({
            selector: 'app-playground-toastr',
            templateUrl: './playground-toastr.component.html',
        }),
        __metadata("design:paramtypes", [ngx_toastr_1.ToastrService])
    ], PlaygroundToastrComponent);
    return PlaygroundToastrComponent;
}());
exports.PlaygroundToastrComponent = PlaygroundToastrComponent;
//# sourceMappingURL=playground-toastr.component.js.map