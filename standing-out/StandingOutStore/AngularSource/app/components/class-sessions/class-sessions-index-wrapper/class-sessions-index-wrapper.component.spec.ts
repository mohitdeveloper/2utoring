import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsIndexWrapperComponent } from './class-sessions-index-wrapper.component';

describe('ClassSessionsIndexWrapperComponent', () => {
  let component: ClassSessionsIndexWrapperComponent;
  let fixture: ComponentFixture<ClassSessionsIndexWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsIndexWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsIndexWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
