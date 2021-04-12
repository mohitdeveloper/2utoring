import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassSessionsDialogComponent } from './course-class-sessions-dialog.component';

describe('CourseClassSessionsDialogComponent', () => {
  let component: CourseClassSessionsDialogComponent;
  let fixture: ComponentFixture<CourseClassSessionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseClassSessionsDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassSessionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
