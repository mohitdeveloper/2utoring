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
exports.SubjectStudyLevelSearchModel = void 0;
var table_search_1 = require("./table-search");
var SubjectStudyLevelSearchModel = /** @class */ (function (_super) {
    __extends(SubjectStudyLevelSearchModel, _super);
    function SubjectStudyLevelSearchModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SubjectStudyLevelSearchModel;
}(table_search_1.TableSearch));
exports.SubjectStudyLevelSearchModel = SubjectStudyLevelSearchModel;
//# sourceMappingURL=subject-study-level-filter.model.js.map