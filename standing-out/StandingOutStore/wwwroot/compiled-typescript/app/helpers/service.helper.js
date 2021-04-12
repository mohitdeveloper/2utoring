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
exports.ServiceHelper = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var ServiceHelper = /** @class */ (function () {
    function ServiceHelper() {
        this.baseApi = environment_1.environment.baseApiUrl;
    }
    ServiceHelper.prototype.buildHeader = function () {
        //let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.currentUserService.getCurrentUser().token });
        //headers.append('Content-Type', 'application/json');
        var headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json' });
        return headers;
    };
    ServiceHelper = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ServiceHelper);
    return ServiceHelper;
}());
exports.ServiceHelper = ServiceHelper;
//# sourceMappingURL=service.helper.js.map