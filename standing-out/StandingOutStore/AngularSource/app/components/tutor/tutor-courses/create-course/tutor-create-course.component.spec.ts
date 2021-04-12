import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCreateCourseComponent } from './tutor-create-course.component';

describe('TutorCoursesComponent', () => {
    let component: TutorCreateCourseComponent;
    let fixture: ComponentFixture<TutorCreateCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TutorCreateCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(TutorCreateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
