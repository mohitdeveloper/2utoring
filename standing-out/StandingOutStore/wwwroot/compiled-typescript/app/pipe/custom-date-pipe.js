"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDatePipe = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var CustomDatePipe = /** @class */ (function () {
    function CustomDatePipe() {
    }
    CustomDatePipe.prototype.transform = function (date, type) {
        if (type == 'date') {
            return this.extractDate(date);
        }
        else {
            return this.extractTime(date);
        }
    };
    CustomDatePipe.prototype.extractDate = function (dt) {
        return new common_1.DatePipe('en-US').transform(new Date(dt), "EEE d MMM y");
    };
    CustomDatePipe.prototype.extractTime = function (tm) {
        var _a = (tm.split('-')[0]).split(':'), hh = _a[0], mm = _a[1];
        hh = parseInt(hh);
        mm = parseInt(mm);
        var dt = new Date();
        dt.setHours(hh, mm);
        return new common_1.DatePipe('en-US').transform(dt, "h:mm a");
    };
    CustomDatePipe = __decorate([
        core_1.Pipe({
            name: 'customdatetime'
        })
    ], CustomDatePipe);
    return CustomDatePipe;
}());
exports.CustomDatePipe = CustomDatePipe;
//# sourceMappingURL=custom-date-pipe.js.map