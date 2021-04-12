"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var course_class_sessions_dialog_component_1 = require("./course-class-sessions-dialog.component");
describe('CourseClassSessionsDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [course_class_sessions_dialog_component_1.CourseClassSessionsDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(course_class_sessions_dialog_component_1.CourseClassSessionsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=course-class-sessions-dialog.component.spec.js.map