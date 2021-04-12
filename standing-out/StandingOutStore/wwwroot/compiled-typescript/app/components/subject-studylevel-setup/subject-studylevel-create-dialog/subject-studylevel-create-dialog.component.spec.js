"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var subject_studylevel_create_dialog_component_1 = require("./subject-studylevel-create-dialog.component");
describe('SubjectStudylevelCreateDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=subject-studylevel-create-dialog.component.spec.js.map