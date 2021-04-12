"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexHelper = void 0;
var RegexHelper = /** @class */ (function () {
    function RegexHelper() {
        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.passwordRegex = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[\W_])/;
        this.contactNumberRegex = /^(?!0123456789|9876543210|9999999999|0000000000)([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$)/;
        this.postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
    }
    return RegexHelper;
}());
exports.RegexHelper = RegexHelper;
//# sourceMappingURL=regex.helper.js.map