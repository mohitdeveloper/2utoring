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
exports.ClassSessionMaterialUploaderComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../services");
var ng2_file_upload_1 = require("ng2-file-upload");
var helpers_1 = require("../../helpers");
var ngx_toastr_1 = require("ngx-toastr");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var components_1 = require("../../components");
var ClassSessionMaterialUploaderComponent = /** @class */ (function () {
    function ClassSessionMaterialUploaderComponent(sessionDocumentsService, toastr, modalService) {
        this.sessionDocumentsService = sessionDocumentsService;
        this.toastr = toastr;
        this.modalService = modalService;
        this.serviceHelper = new helpers_1.ServiceHelper();
        this.emitLoaded = new core_1.EventEmitter();
        this.sessionDocuments = [];
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.serviceHelper.baseApi + ("/api/sessionDocuments/" + this.type + "/upload/") + this.classSessionId, method: 'POST' });
        this.dropZoneOver = false;
        this.uploaderShow = true;
    }
    ClassSessionMaterialUploaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uploader.options.url = this.serviceHelper.baseApi + ("/api/sessionDocuments/" + this.type + "/upload/") + this.classSessionId;
        this.sessionDocumentsService.getFiles(this.classSessionId, this.type)
            .subscribe(function (success) {
            _this.sessionDocuments = success;
            _this.emitLoaded.emit(true);
        }, function (error) {
        });
    };
    ;
    ClassSessionMaterialUploaderComponent.prototype.fileOver = function (e) {
        debugger;
        this.dropZoneOver = e;
    };
    ClassSessionMaterialUploaderComponent.prototype.fileDropped = function (e) {
        var _this = this;
        debugger;
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                if (status == 200) {
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.ngOnInit();
                }
                else {
                    $('.loading').hide();
                    _this.uploader.clearQueue();
                    _this.uploaderShow = true;
                    _this.toastr.error('We were unable to upload your document');
                }
            };
        }
    };
    ClassSessionMaterialUploaderComponent.prototype.deleteSessionDocument = function (sessionDocument) {
        var _this = this;
        $('.loading').show();
        this.sessionDocumentsService.delete(this.classSessionId, sessionDocument.id)
            .subscribe(function (success) {
            _this.ngOnInit();
        }, function (error) {
        });
    };
    ;
    ClassSessionMaterialUploaderComponent.prototype.sharedPermissions = function () {
        this.toastr.warning('This feature is coming soon!');
        return;
    };
    ClassSessionMaterialUploaderComponent.prototype.setPermissions = function (sessionDocument) {
        var _this = this;
        debugger;
        var modalRef = this.modalService.open(components_1.DocumentPermissionModalComponent, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.fileIds = [sessionDocument.id];
        modalRef.componentInstance.type = this.type;
        modalRef.componentInstance.classSessionId = this.classSessionId;
        //handle the response
        modalRef.result.then(function (result) {
            _this.ngOnInit();
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionMaterialUploaderComponent.prototype, "titleInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionMaterialUploaderComponent.prototype, "subtitleInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionMaterialUploaderComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionMaterialUploaderComponent.prototype, "classSessionId", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ClassSessionMaterialUploaderComponent.prototype, "emitLoaded", void 0);
    ClassSessionMaterialUploaderComponent = __decorate([
        core_1.Component({
            selector: 'app-class-session-material-uploader',
            templateUrl: './class-session-material-uploader.component.html',
            styleUrls: ['./class-session-material-uploader.component.scss']
        }),
        __metadata("design:paramtypes", [services_1.SessionDocumentsService, ngx_toastr_1.ToastrService, ng_bootstrap_1.NgbModal])
    ], ClassSessionMaterialUploaderComponent);
    return ClassSessionMaterialUploaderComponent;
}());
exports.ClassSessionMaterialUploaderComponent = ClassSessionMaterialUploaderComponent;
//# sourceMappingURL=class-session-material-uploader.component.js.map