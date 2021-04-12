import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyManageCourseComponent } from './company-manage-course.component';

describe('TutorCoursesComponent', () => {
    let component: CompanyManageCourseComponent;
    let fixture: ComponentFixture<CompanyManageCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [CompanyManageCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(CompanyManageCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
