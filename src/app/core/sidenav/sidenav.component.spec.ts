import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { SidenavComponent } from './sidenav.component';
import { SidenavService } from './sidenav.service';
import { AuthService } from '../../auth/shared/auth.service';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    class MockAuthService {
      authenticated(): boolean { return false; }
      getUserDisplayName(): string { return 'Test User'; }
      logout(): void { }
    }

    class MockSidenavService {
      toggle$ = Observable.of(undefined);
    }

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ SidenavComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SidenavService, useClass: MockSidenavService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(inject([SidenavService], (sidenavService: SidenavService) => {
      sidenavService.toggle$ = Observable.of(true);
      component.sidenavElement = { toggle: () => undefined };
    }));

    it('should call sidenavElement `trigger()` when toggle is triggered', () => {
      const sidenavElementSpy = spyOn(component.sidenavElement, 'toggle');

      component.ngOnInit();
      expect(sidenavElementSpy).toHaveBeenCalled();
    });
  });

  describe('getUserDisplayName()', () => {
    it('should get user display name', inject([AuthService], (authService: AuthService) => {
      spyOn(authService, 'getUserDisplayName').and.returnValue('Test User');

      const displayName: string = component.getUserDisplayName();
      expect(displayName).toEqual('Test User');
    }));
  });

  describe('isAuthenticated()', () => {
    it('should call AuthService `authenticated()`', inject([AuthService], (authService: AuthService) => {
      const authSpy = spyOn(authService, 'authenticated');

      component.isAuthenticated();
      expect(authSpy).toHaveBeenCalled();
    }));
  });

  describe('onLogout()', () => {
    let authLogoutSpy;
    let logoutNativeElement;

    beforeEach(inject([AuthService], (authService: AuthService) => {
      spyOn(authService, 'authenticated').and.returnValue(true);
      authLogoutSpy = spyOn(authService, 'logout');

      fixture.detectChanges();

      component.sidenavElement = { close: () => undefined };

      const logoutDebugElement = fixture.debugElement.query(By.css('#logout-list-item'));
      logoutNativeElement = logoutDebugElement.nativeElement;
    }));

    it('should call `onLogout()` when "Logout" button is clicked', async(() => {
      const logoutSpy = spyOn(component, 'onLogout');

      logoutNativeElement.click();

      fixture.whenStable().then(() => {
        expect(logoutSpy).toHaveBeenCalled();
      });
    }));

    it('should close sidenav when "Logout" button is clicked', async(() => {
      const sidenavToggleSpy = spyOn(component.sidenavElement, 'close');

      logoutNativeElement.click();

      fixture.whenStable().then(() => {
        expect(sidenavToggleSpy).toHaveBeenCalled();
      });
    }));

    it('should call AuthService `logout()` when "Logout" button is clicked', async(() => {
      logoutNativeElement.click();

      fixture.whenStable().then(() => {
        expect(authLogoutSpy).toHaveBeenCalled();
      });
    }));
  });

  describe('onNavigate()', () => {
    let routerSpy;

    beforeEach(inject([AuthService, Router], (authService: AuthService, router: Router) => {
      spyOn(authService, 'authenticated').and.returnValue(true);

      fixture.detectChanges();

      routerSpy = spyOn(router, 'navigate');
      component.sidenavElement = { close: () => undefined };
    }));

    describe('when dashboard list item is clicked', () => {
      let dashboardNavDebugElement;
      let dashboardNavNativeElement;

      beforeEach(() => {
        dashboardNavDebugElement = fixture.debugElement.query(By.css('#dashboard-list-item'));
        dashboardNavNativeElement = dashboardNavDebugElement.nativeElement;
      });

      it('should call sidenavElement `close()`', async(() => {

        const closeSidenavSpy = spyOn(component.sidenavElement, 'close');

        dashboardNavNativeElement.click();

        fixture.whenStable().then(() => {
          expect(closeSidenavSpy).toHaveBeenCalled();
        });
      }));

      it('should navigate to `/dashboard`', async(() => {
        dashboardNavNativeElement.click();

        fixture.whenStable().then(() => {
          expect(routerSpy).toHaveBeenCalledWith(['/dashboard']);
        });
      }));
    });
  });
});
