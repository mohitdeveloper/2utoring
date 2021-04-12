"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var class_sessions_index_wrapper_component_1 = require("./class-sessions-index-wrapper.component");
describe('ClassSessionsIndexWrapperComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [class_sessions_index_wrapper_component_1.ClassSessionsIndexWrapperComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(class_sessions_index_wrapper_component_1.ClassSessionsIndexWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=class-sessions-index-wrapper.component.spec.js.map