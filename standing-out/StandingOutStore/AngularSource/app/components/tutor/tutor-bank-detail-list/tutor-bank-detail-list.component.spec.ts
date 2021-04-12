import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorBankDetailsListComponent } from './tutor-bank-detail-list.component';

describe('TutorBankDetailsListComponent', () => {
    let component: TutorBankDetailsListComponent;
    let fixture: ComponentFixture<TutorBankDetailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TutorBankDetailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(TutorBankDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
