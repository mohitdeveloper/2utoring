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
exports.ClassSessionAdminDetailsComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var models_1 = require("../../../models");
var ngx_toastr_1 = require("ngx-toastr");
var ClassSessionAdminDetailsComponent = /** @class */ (function () {
    function ClassSessionAdminDetailsComponent(classSessionsService, toastr) {
        this.classSessionsService = classSessionsService;
        this.toastr = toastr;
        this.title = title;
        this.classSessionId = classSessionId;
        this.classSession = new models_1.ClassSession();
        this.classSessionOwnerId = classSessionOwnerId;
        this.loaded = 0;
        this.toLoad = 1;
        this.groups = [];
    }
    ClassSessionAdminDetailsComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    ClassSessionAdminDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        debugger;
        this.classSessionsService.getRooms(this.classSessionId).subscribe(function (success) {
            _this.groups = success;
            _this.incrementLoad();
        }, function (err) {
        });
        this.getClassSession();
    };
    ClassSessionAdminDetailsComponent.prototype.getClassSession = function () {
        var _this = this;
        this.classSessionsService.getById(this.classSessionId).subscribe(function (success) {
            _this.classSession = success;
            console.log("Under16:", _this.classSession.isUnder16);
            // this.classSession.isUnder16
        }, function (err) { });
    };
    ClassSessionAdminDetailsComponent.prototype.viewRecording = function (classSessionVideoRoomId) {
        if (this.classSession.isUnder16 == false) {
            this.toastr.error("Sorry, no recordings stored for Over 18 sessions");
        }
        else
            window.location.href = "/admin/classsessions/generatecomposition/" + classSessionVideoRoomId;
    };
    ClassSessionAdminDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-class-session-admin-details',
            templateUrl: './class-session-admin-details.component.html',
            styleUrls: ['./class-session-admin-details.component.css']
        }),
        __metadata("design:paramtypes", [services_1.ClassSessionsService,
            ngx_toastr_1.ToastrService])
    ], ClassSessionAdminDetailsComponent);
    return ClassSessionAdminDetailsComponent;
}());
exports.ClassSessionAdminDetailsComponent = ClassSessionAdminDetailsComponent;
//# sourceMappingURL=class-session-admin-details.component.js.map