import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileWrapperComponent } from './tutor-profile-wrapper.component';

describe('TutorProfileWrapperComponent', () => {
  let component: TutorProfileWrapperComponent;
  let fixture: ComponentFixture<TutorProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
