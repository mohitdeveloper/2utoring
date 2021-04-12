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
var core_1 = require("@angular/core");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var PlaygroundDragComponent = /** @class */ (function () {
    function PlaygroundDragComponent() {
        this.movies = [
            'Episode I - The Phantom Menace',
            'Episode II - Attack of the Clones',
            'Episode III - Revenge of the Sith',
            'Episode IV - A New Hope',
            'Episode V - The Empire Strikes Back',
            'Episode VI - Return of the Jedi',
            'Episode VII - The Force Awakens',
            'Episode VIII - The Last Jedi'
        ];
        this.todo = [
            'Get to work',
            'Pick up groceries',
            'Go home',
            'Fall asleep'
        ];
        this.done = [
            'Get up',
            'Brush teeth',
            'Take a shower',
            'Check e-mail',
            'Walk dog'
        ];
    }
    PlaygroundDragComponent.prototype.drop = function (event) {
        drag_drop_1.moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    };
    PlaygroundDragComponent.prototype.dropExampleTwo = function (event) {
        if (event.previousContainer === event.container) {
            drag_drop_1.moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else {
            drag_drop_1.transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    };
    PlaygroundDragComponent.prototype.ngOnInit = function () {
    };
    PlaygroundDragComponent = __decorate([
        core_1.Component({
            selector: 'app-playground-drag',
            templateUrl: './playground-drag.component.html',
            styleUrls: ['./playground-drag.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], PlaygroundDragComponent);
    return PlaygroundDragComponent;
}());
exports.PlaygroundDragComponent = PlaygroundDragComponent;
//# sourceMappingURL=playground-drag.component.js.map