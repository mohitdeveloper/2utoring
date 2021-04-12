import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderSchedulerComponent } from './calender-scheduler.component';

describe('CalenderComponent', () => {
  let component: CalenderSchedulerComponent;
    let fixture: ComponentFixture<CalenderSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [CalenderSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(CalenderSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
