import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileWrapperComponent } from './company-profile-wrapper.component';

describe('CompanyProfileWrapperComponent', () => {
  let component: CompanyProfileWrapperComponent;
  let fixture: ComponentFixture<CompanyProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
