import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorDbsDetailsComponent } from './tutor-dbs-details.component';

describe('TutorDbsDetailsComponent', () => {
  let component: TutorDbsDetailsComponent;
  let fixture: ComponentFixture<TutorDbsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorDbsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorDbsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
