import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLinkAccountComponent } from './user-link-account.component';

describe('UserChangePasswordComponent', () => {
    let component: UserLinkAccountComponent;
    let fixture: ComponentFixture<UserLinkAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [UserLinkAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(UserLinkAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
