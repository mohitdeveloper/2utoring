import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCourseDetailsDialogComponent } from './checkout-course-details-dialog.component';

describe('CheckoutCourseDetailsDialogComponent', () => {
  let component: CheckoutCourseDetailsDialogComponent;
  let fixture: ComponentFixture<CheckoutCourseDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutCourseDetailsDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCourseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
