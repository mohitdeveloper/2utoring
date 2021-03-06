import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanComponent } from './subscription-plan.component';

describe('TutorRegisterComponent', () => {
  let component: SubscriptionPlanComponent;
  let fixture: ComponentFixture<SubscriptionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
