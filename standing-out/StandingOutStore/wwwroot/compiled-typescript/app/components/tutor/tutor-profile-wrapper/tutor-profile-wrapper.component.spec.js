"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var tutor_profile_wrapper_component_1 = require("./tutor-profile-wrapper.component");
describe('TutorProfileWrapperComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tutor_profile_wrapper_component_1.TutorProfileWrapperComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tutor_profile_wrapper_component_1.TutorProfileWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tutor-profile-wrapper.component.spec.js.map