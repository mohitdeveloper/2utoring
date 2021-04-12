import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAccountDetailsComponent } from './company-account-details.component';

describe('CompanyAccountDetailsComponent', () => {
  let component: CompanyAccountDetailsComponent;
  let fixture: ComponentFixture<CompanyAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
