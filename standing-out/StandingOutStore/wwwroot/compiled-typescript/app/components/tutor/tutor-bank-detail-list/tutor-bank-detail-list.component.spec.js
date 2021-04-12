"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var tutor_bank_detail_list_component_1 = require("./tutor-bank-detail-list.component");
describe('TutorBankDetailsListComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tutor_bank_detail_list_component_1.TutorBankDetailsListComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tutor_bank_detail_list_component_1.TutorBankDetailsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tutor-bank-detail-list.component.spec.js.map