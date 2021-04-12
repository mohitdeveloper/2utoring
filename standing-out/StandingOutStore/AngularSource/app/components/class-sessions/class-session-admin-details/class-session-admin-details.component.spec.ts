import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionAdminDetailsComponent } from './class-session-admin-details.component';

describe('ClassSessionAdminDetailsComponent', () => {
    let component: ClassSessionAdminDetailsComponent;
    let fixture: ComponentFixture<ClassSessionAdminDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ClassSessionAdminDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(ClassSessionAdminDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
