"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var service_helper_1 = require("../../../helpers/service.helper");
var PlaygroundUploadComponent = /** @class */ (function () {
    function PlaygroundUploadComponent() {
        this.serviceHelper = new service_helper_1.ServiceHelper();
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + '/api/playground/upload', method: 'POST' });
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
    }
    PlaygroundUploadComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    PlaygroundUploadComponent.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    PlaygroundUploadComponent = __decorate([
        core_1.Component({
            selector: 'app-playground-upload',
            templateUrl: './playground-upload.component.html',
            styleUrls: ['./playground-upload.component.scss']
        })
    ], PlaygroundUploadComponent);
    return PlaygroundUploadComponent;
}());
exports.PlaygroundUploadComponent = PlaygroundUploadComponent;
//# sourceMappingURL=playground-upload.component.js.map