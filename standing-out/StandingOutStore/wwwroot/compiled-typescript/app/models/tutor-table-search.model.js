"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorTableSearch = void 0;
var table_search_1 = require("./table-search");
var TutorTableSearch = /** @class */ (function (_super) {
    __extends(TutorTableSearch, _super);
    function TutorTableSearch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.profileFilter = 'All';
        _this.dbsFilter = 'All';
        return _this;
    }
    return TutorTableSearch;
}(table_search_1.TableSearch));
exports.TutorTableSearch = TutorTableSearch;
//# sourceMappingURL=tutor-table-search.model.js.map