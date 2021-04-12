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
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var core_2 = require("@fullcalendar/core"); // include this line
var daygrid_1 = require("@fullcalendar/daygrid");
var AppComponent = /** @class */ (function () {
    function AppComponent(http) {
        this.http = http;
        this.calendarOptions = {
            plugins: [daygrid_1.default],
            initialView: 'dayGridMonth'
        };
        this.mode = document.getElementById("app-angular").getAttribute("app-mode");
        //this.mode = 'tutor-register';
        this.calendarName = core_2.Calendar.name; // add this line in your constructor 
    }
    AppComponent.prototype.ngOnInit = function () {
        //console.log(this.calendarName);
    };
    AppComponent.prototype.ngAfterViewInit = function () {
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map