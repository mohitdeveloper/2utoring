"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var subject_studylevel_info_dialog_component_1 = require("./subject-studylevel-info-dialog.component");
describe('SubjectStudylevelInfoDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [subject_studylevel_info_dialog_component_1.SubjectStudylevelInfoDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(subject_studylevel_info_dialog_component_1.SubjectStudylevelInfoDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=subject-studylevel-info-dialog.component.spec.js.map