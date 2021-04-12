import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsRegisterComponent } from './class-sessions-register.component';

describe('ClassSessionsRegisterComponent', () => {
  let component: ClassSessionsRegisterComponent;
  let fixture: ComponentFixture<ClassSessionsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
