import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAccountDetailsComponent } from './tutor-account-details.component';

describe('TutorAccountDetailsComponent', () => {
  let component: TutorAccountDetailsComponent;
  let fixture: ComponentFixture<TutorAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
