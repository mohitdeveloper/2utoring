import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsDetailsComponent } from './class-sessions-details.component';

describe('ClassSessionsDetailsComponent', () => {
  let component: ClassSessionsDetailsComponent;
  let fixture: ComponentFixture<ClassSessionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
