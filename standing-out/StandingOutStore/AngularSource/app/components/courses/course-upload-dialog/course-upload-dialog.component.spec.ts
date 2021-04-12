import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUploadDialogComponent } from './course-upload-dialog.component';

describe('CourseUploadDialogComponent', () => {
  let component: CourseUploadDialogComponent;
  let fixture: ComponentFixture<CourseUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUploadDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
