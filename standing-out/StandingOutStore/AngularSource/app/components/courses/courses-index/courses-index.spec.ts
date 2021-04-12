import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesIndexComponent } from './courses-index.component';

describe('CoursesIndexComponent', () => {
  let component: CoursesIndexComponent;
  let fixture: ComponentFixture<CoursesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
