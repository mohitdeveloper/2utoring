"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var class_sessions_admin_index_component_1 = require("./class-sessions-admin-index.component");
describe('ClassSessionsAdminIndexComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [class_sessions_admin_index_component_1.ClassSessionsAdminIndexComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(class_sessions_admin_index_component_1.ClassSessionsAdminIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=class-sessions-admin-index.component.spec.js.map