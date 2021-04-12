import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileEditComponent } from './tutor-profile-edit.component';

describe('TutorProfileEditComponent', () => {
  let component: TutorProfileEditComponent;
  let fixture: ComponentFixture<TutorProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
