import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileViewComponent } from './tutor-profile-view.component';

describe('TutorProfileViewComponent', () => {
  let component: TutorProfileViewComponent;
  let fixture: ComponentFixture<TutorProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
