import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsMaterialComponent } from './class-sessions-material.component';

describe('ClassSessionsMaterialComponent', () => {
  let component: ClassSessionsMaterialComponent;
  let fixture: ComponentFixture<ClassSessionsMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSessionsMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSessionsMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
