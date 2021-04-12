import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsStudentsComponent } from './class-sessions-students.component';

describe('ClassSessionsStudentsComponent', () => {
  let component: ClassSessionsStudentsComponent;
  let fixture: ComponentFixture<ClassSessionsStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
