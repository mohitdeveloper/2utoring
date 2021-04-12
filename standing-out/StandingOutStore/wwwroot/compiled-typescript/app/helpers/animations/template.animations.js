"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsAnimation = void 0;
var animations_1 = require("@angular/animations");
exports.rowsAnimation = animations_1.trigger('rowsAnimation', [
    animations_1.transition('void => *', [
        animations_1.style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
        animations_1.sequence([
            animations_1.animate(".35s ease", animations_1.style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none' })),
            animations_1.animate(".35s ease", animations_1.style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
        ])
    ])
]);
//# sourceMappingURL=template.animations.js.map