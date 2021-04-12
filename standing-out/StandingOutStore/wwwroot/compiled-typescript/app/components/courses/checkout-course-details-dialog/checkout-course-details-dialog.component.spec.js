"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var checkout_course_details_dialog_component_1 = require("./checkout-course-details-dialog.component");
describe('CheckoutCourseDetailsDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [checkout_course_details_dialog_component_1.CheckoutCourseDetailsDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(checkout_course_details_dialog_component_1.CheckoutCourseDetailsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=checkout-course-details-dialog.component.spec.js.map