import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { SidenavService } from '../sidenav/sidenav.service';
import { AuthService } from '../../auth/shared/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    const authServiceStub = {
      authenticated: () => undefined
    };

    const sidenavServiceStub = {
      triggerToggle: () => undefined
    };

    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: SidenavService, useValue: sidenavServiceStub }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isAuthenticated()', () => {
    it('should call AuthService `authenticated()', inject([AuthService], (authService: AuthService) => {
      const authSpy = spyOn(authService, 'authenticated');

      component.isAuthenticated();
      expect(authSpy).toHaveBeenCalled();
    }));
  });

  describe('onToggleSidenav()', () => {
    it('should call SidenavService `triggerToggle()`', inject([SidenavService], (sidenavService: SidenavService) => {
      const triggerToggleSpy = spyOn(sidenavService, 'triggerToggle');

      component.onToggleSidenav();
      expect(triggerToggleSpy).toHaveBeenCalled();
    }));
  });
});
