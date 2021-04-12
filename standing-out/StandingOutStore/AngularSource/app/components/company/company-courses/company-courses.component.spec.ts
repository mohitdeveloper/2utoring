import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCoursesComponent } from './company-courses.component';

describe('CompanyCoursesComponent', () => {
  let component: CompanyCoursesComponent;
  let fixture: ComponentFixture<CompanyCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
