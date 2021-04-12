import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySubscriptionDetailsComponent } from './company-subscription-details.component';

describe('CompanySubscriptionDetailsComponent', () => {
  let component: CompanySubscriptionDetailsComponent;
  let fixture: ComponentFixture<CompanySubscriptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySubscriptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
