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
var forms_1 = require("@angular/forms");
var PlaygroundWizardComponent = /** @class */ (function () {
    function PlaygroundWizardComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.totalSteps = 2;
        this.currentStep = 1;
    }
    Object.defineProperty(PlaygroundWizardComponent.prototype, "wizardForm1Controls", {
        get: function () { return this.wizardForm1.controls; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaygroundWizardComponent.prototype, "wizardForm2Controls", {
        get: function () { return this.wizardForm2.controls; },
        enumerable: true,
        configurable: true
    });
    PlaygroundWizardComponent.prototype.progressBar = function () {
        var progress = ((100 / this.totalSteps) * this.currentStep);
        return progress;
    };
    PlaygroundWizardComponent.prototype.saveWizardForm1 = function () {
        console.log(this.wizardForm1.valid);
        this.wizardForm1Submitted = true;
        if (this.wizardForm1.valid) {
            this.name = this.wizardForm1.value.name;
            this.currentStep++;
        }
    };
    PlaygroundWizardComponent.prototype.saveWizardForm2 = function () {
        this.wizardForm2Submitted = true;
        if (this.wizardForm2.valid) {
            this.pickADate = this.wizardForm2.value.pickadate;
            console.log(this.pickADate);
            alert('Submit');
        }
    };
    PlaygroundWizardComponent.prototype.previous = function () {
        this.currentStep--;
    };
    PlaygroundWizardComponent.prototype.ngOnInit = function () {
        console.log(this.progressBar());
        this.wizardForm1 = this.formBuilder.group({
            name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(25), forms_1.Validators.minLength(3)]],
        });
        this.wizardForm2 = this.formBuilder.group({
            pickadate: ['', [forms_1.Validators.required]],
        });
    };
    PlaygroundWizardComponent = __decorate([
        core_1.Component({
            selector: 'app-playground-wizard',
            templateUrl: './playground-wizard.component.html',
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], PlaygroundWizardComponent);
    return PlaygroundWizardComponent;
}());
exports.PlaygroundWizardComponent = PlaygroundWizardComponent;
//# sourceMappingURL=playground-wizard.component.js.map