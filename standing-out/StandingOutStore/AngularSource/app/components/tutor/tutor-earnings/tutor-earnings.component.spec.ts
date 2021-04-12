import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorEarningsComponent } from './tutor-earnings.component';

describe('TutorEarningsComponent', () => {
    let component: TutorEarningsComponent;
    let fixture: ComponentFixture<TutorEarningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TutorEarningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(TutorEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
