import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectStudylevelCreateDialogComponent } from './subject-studylevel-create-dialog.component';

describe('SubjectStudylevelCreateDialogComponent', () => {
  let component: SubjectStudylevelCreateDialogComponent;
  let fixture: ComponentFixture<SubjectStudylevelCreateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectStudylevelCreateDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectStudylevelCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
