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
exports.SettingsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var SettingsService = /** @class */ (function () {
    function SettingsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    // This commission is no longer valid.. See Subscription Features - Commission Tiers
    SettingsService.prototype.getBaseClassSessionCommision = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/settings/getBaseClassSessionCommision', { headers: this.serviceHelper.buildHeader() });
    };
    SettingsService.prototype.getIdentitySiteUrl = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/settings/getIdentitySiteUrl', { headers: this.serviceHelper.buildHeader() });
    };
    SettingsService.prototype.getSetting = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/settings/getSetting', { headers: this.serviceHelper.buildHeader() });
    };
    SettingsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map