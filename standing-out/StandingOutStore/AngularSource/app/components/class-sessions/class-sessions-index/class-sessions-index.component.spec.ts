import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsIndexComponent } from './class-sessions-index.component';

describe('ClassSessionsIndexComponent', () => {
  let component: ClassSessionsIndexComponent;
  let fixture: ComponentFixture<ClassSessionsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
