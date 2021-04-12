import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorSubscriptionDetailsComponent } from './tutor-subscription-details.component';

describe('TutorSubscriptionDetailsComponent', () => {
  let component: TutorSubscriptionDetailsComponent;
  let fixture: ComponentFixture<TutorSubscriptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorSubscriptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorSubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
