import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectStudylevelInfoDialogComponent } from './subject-studylevel-info-dialog.component';

describe('SubjectStudylevelInfoDialogComponent', () => {
  let component: SubjectStudylevelInfoDialogComponent;
  let fixture: ComponentFixture<SubjectStudylevelInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectStudylevelInfoDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectStudylevelInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
