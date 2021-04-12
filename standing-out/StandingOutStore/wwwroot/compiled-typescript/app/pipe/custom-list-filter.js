"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomListPipe = void 0;
var core_1 = require("@angular/core");
var CustomListPipe = /** @class */ (function () {
    function CustomListPipe() {
    }
    CustomListPipe.prototype.transform = function (items, filter) {
        if (!items || !filter) {
            return items;
        }
        var returnvalue = items.filter(function (item) { return item.firstName.startsWith(filter); });
        return returnvalue;
    };
    CustomListPipe = __decorate([
        core_1.Pipe({
            name: 'listfilter'
        })
    ], CustomListPipe);
    return CustomListPipe;
}());
exports.CustomListPipe = CustomListPipe;
//# sourceMappingURL=custom-list-filter.js.map