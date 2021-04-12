import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteStudentDialogComponent } from './invite-student-dialog.component';

describe('InviteStudentDialogComponent', () => {
  let component: InviteStudentDialogComponent;
  let fixture: ComponentFixture<InviteStudentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InviteStudentDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
