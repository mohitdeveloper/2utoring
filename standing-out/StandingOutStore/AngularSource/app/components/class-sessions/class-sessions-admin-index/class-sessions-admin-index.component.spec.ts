import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsAdminIndexComponent } from './class-sessions-admin-index.component';

describe('ClassSessionsAdminIndexComponent', () => {
    let component: ClassSessionsAdminIndexComponent;
    let fixture: ComponentFixture<ClassSessionsAdminIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClassSessionsAdminIndexComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassSessionsAdminIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
