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
exports.CustomRandomPipe = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../services");
var CustomRandomPipe = /** @class */ (function () {
    function CustomRandomPipe(cs) {
        this.cs = cs;
    }
    CustomRandomPipe.prototype.transform = function (i, subImages, subName) {
        debugger;
        var randNum;
        if (!this.cs.imagesSequence[subName]) {
            this.cs.imagesSequence[subName] = 1;
            randNum = 0;
        }
        else {
            randNum = this.cs.imagesSequence[subName] % (subImages.length);
            this.cs.imagesSequence[subName] = this.cs.imagesSequence[subName] + 1;
        }
        //var randNum = Math.random() * (4 - 1) + 1;
        if (subImages && subImages[randNum]) {
            return '/images/subjects/' + subImages[randNum];
        }
        else {
            debugger;
            //let randNumber = Math.floor((Math.random() * 9) + 0); //0 to 9 0 Where Start 9 Where Stop
            if (!this.cs.imagesSequence['general_images']) {
                this.cs.imagesSequence['general_images'] = 1;
                randNum = 0;
            }
            else {
                randNum = this.cs.imagesSequence['general_images'] % 31;
                this.cs.imagesSequence['general_images'] = this.cs.imagesSequence['general_images'] + 1;
            }
            console.log('/images/subjects/general_images/' + services_1.subjectImages['general_images'][randNum]);
            return '/images/subjects/general_images/' + services_1.subjectImages['general_images'][randNum];
        }
        //return '/images/subjects/' + (subImages ? (subImages[randNum] ? subImages[randNum]:'default.png'):'default.png');
    };
    CustomRandomPipe = __decorate([
        core_1.Pipe({
            name: 'randomimage'
        }),
        __metadata("design:paramtypes", [services_1.CoursesService])
    ], CustomRandomPipe);
    return CustomRandomPipe;
}());
exports.CustomRandomPipe = CustomRandomPipe;
//# sourceMappingURL=custom-random-image-pipe.js.map