import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Rx';

import { AuthService } from './auth.service';
import { AppMetadata } from './models/app-metadata.model';
import { Authorization } from './models/authorization.model';
import { UserMetadata } from './models/user-metadata.model';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [ AuthService ]
    });
  });

  it('should create', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('authenticated()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should return false if `id_token` does not exist', () => {
      localStorage.removeItem('id_token');

      expect(authService.authenticated()).toBeFalsy();
    });
  });

  describe('call$()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should call `MeteorObservable.call()`', () => {
      const meteorSpy = spyOn(MeteorObservable, 'call').and.returnValue(Observable.of(undefined));
      spyOn(authService, 'getIDToken').and.returnValue('SAMPLE_TOKEN');

      authService.call$('methodName', 'arg1', 'arg2', 'arg3').subscribe(() => {
        expect(meteorSpy).toHaveBeenCalledWith('methodName', 'SAMPLE_TOKEN', 'arg1', 'arg2', 'arg3');
      });
    });

    it('should throw an error if `id_token` does not exist', () => {
      spyOn(authService, 'getIDToken').and.returnValue(undefined);

      authService.call$('methodName').subscribe({
        next: () => undefined,
        error: (error: Meteor.Error) => {
          expect(error).toBeDefined();
          expect(error.error).toEqual(401);
          expect(error.reason).toEqual('Unauthorized. ');
        }
      });
    });

    it('should throw an error if `name` is undefined', () => {
      authService.call$().subscribe({
        next: () => undefined,
        error: (error: Meteor.Error) => {
          expect(error).toBeDefined();
          expect(error.error).toEqual(400);
          expect(error.reason).toEqual('Undefined call target. ');
        }
      });
    });
  });

  describe('getUserDisplayName()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s full name if defined', () => {
      spyOn(authService, 'getUserFullName').and.returnValue('Foo Bar');

      expect(authService.getUserDisplayName()).toEqual('Foo Bar');
    });

    it('should get user\'s e-mail address if full name is undefined', () => {
      spyOn(authService, 'getUserFullName').and.returnValue(undefined);
      spyOn(authService, 'getUserEmail').and.returnValue('foo@bar.com');

      expect(authService.getUserDisplayName()).toEqual('foo@bar.com');
    });

    it('should get user ID if full name and e-mail address are undefined', () => {
      spyOn(authService, 'getUserFullName').and.returnValue(undefined);
      spyOn(authService, 'getUserEmail').and.returnValue(undefined);
      spyOn(authService, 'getUserID').and.returnValue('sample_user_id');

      expect(authService.getUserDisplayName()).toEqual('sample_user_id');
    });

    it('should return `undefined` if full name, e-mail address and user ID are undefined', () => {
      spyOn(authService, 'getUserFullName').and.returnValue(undefined);
      spyOn(authService, 'getUserEmail').and.returnValue(undefined);
      spyOn(authService, 'getUserID').and.returnValue(undefined);

      expect(authService.getUserDisplayName()).toBeUndefined();
    });
  });

  describe('getUserEmail()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user e-mail if defined', () => {
      spyOn(authService, 'hasProfileProperty').and.returnValue(true);
      spyOn(authService, 'getUserProfile').and.returnValue({ email: 'foo@bar.com' });

      expect(authService.getUserEmail()).toEqual('foo@bar.com');
    });

    it('should return `undefined` if user e-mail is undefined', () => {
      spyOn(authService, 'hasProfileProperty').and.returnValue(false);

      expect(authService.getUserEmail()).toBeUndefined();
    });
  });

  describe('getUserFirstName()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s first name if defined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue({ first_name: 'Foo' });

      expect(authService.getUserFirstName()).toEqual('Foo');
    });

    it('should return `undefined` if user\'s first name is undefined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue(undefined);

      expect(authService.getUserFirstName()).toBeUndefined();
    });
  });

  describe('getUserFullName()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s full name if both first name and last name are defined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue({
        first_name: 'Foo',
        last_name: 'Bar'
      });

      expect(authService.getUserFullName()).toEqual('Foo Bar');
    });

    it('should return `undefined` if user\'s first name is defined and last name is undefined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue({
        first_name: 'Foo'
      });

      expect(authService.getUserFullName()).toBeUndefined();
    });

    it('should return `undefined` if user\'s first name is undefined and last name is defined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue({
        last_name: 'Foo'
      });

      expect(authService.getUserFullName()).toBeUndefined();
    });

    it('should return `undefined` if both user\'s first name and last name are undefined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue(undefined);

      expect(authService.getUserFullName()).toBeUndefined();
    });
  });

  describe('getUserID()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user ID if defined', () => {
      spyOn(authService, 'getUserProfile').and.returnValue({ user_id: 'sample_user_id' });

      expect(authService.getUserID()).toEqual('sample_user_id');
    });

    it('should return `undefined` if user ID is not defined', () => {
      spyOn(authService, 'getUserProfile').and.returnValue(undefined);

      expect(authService.getUserID()).toBeUndefined();
    });
  });

  describe('getUserLastName()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s last name if defined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue({ last_name: 'Bar' });

      expect(authService.getUserLastName()).toEqual('Bar');
    });

    it('should return `undefined` if user\'s last name is not defined', () => {
      spyOn(authService, 'getUserMetadata').and.returnValue(undefined);

      expect(authService.getUserLastName()).toBeUndefined();
    });
  });

  describe('login()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should show lock', () => {
      const lockSpy = spyOn(authService.lock, 'show');

      authService.login();
      expect(lockSpy).toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    let authService;
    let routerSpy;

    beforeEach(inject([AuthService, Router], (service: AuthService, router: Router) => {
      authService = service;
      routerSpy = spyOn(router, 'navigate');
    }));

    it('should clear user-related localStorage', () => {
      authService.logout();

      expect(authService.getIDToken()).toBeFalsy();
      expect(authService.getUserProfile()).toBeFalsy();
    });

    it('should navigate to `/login`', () => {
      authService.logout();
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getUserAuthorization()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should return user\'s authorization if defined', () => {
      const userAuthorization: Authorization = {
        groups: [ 'group_1' ],
        roles: [ 'role_1 '],
        permissions: [ 'permission_1' ]
      };

      spyOn(authService, 'getUserAppMetadata').and.returnValue({
        authorization: userAuthorization
      });

      expect(authService.getUserAuthorization()).toEqual(userAuthorization);
    });

    it('should return `undefined` if user\'s authorization is not defined', () => {
      spyOn(authService, 'getUserAppMetadata').and.returnValue(undefined);

      expect(authService.getUserAuthorization()).toBeUndefined();
    });
  });

  describe('getUserAppMetadata()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user app metadata if defined', () => {
      const appMetadata: AppMetadata = {
        authorization: {
          groups: [ 'group_1' ],
          roles: [ 'role_1' ],
          permissions: [ 'permission_1']
        }
      };

      authService.userProfile = { app_metadata: appMetadata };

      expect(authService.getUserAppMetadata()).toEqual(appMetadata);
    });

    it('should return `undefined` if uer app metadata is not defined', () => {
      authService.userProfile = undefined;

      expect(authService.getUserAppMetadata()).toBeUndefined();
    });
  });

  describe('getIDToken()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s ID token from localStorage if defined', () => {
      spyOn(localStorage, 'getItem').and.callFake((name: string) => {
        return (name === 'id_token') ? 'SAMPLE_TOKEN' : undefined;
      });

      expect(authService.getIDToken()).toEqual('SAMPLE_TOKEN');
    });
  });

  describe('getUserMetadata()', () => {
    let authService;

    beforeEach(inject([AuthService], (service: AuthService) => {
      authService = service;
    }));

    it('should get user\'s metadata if defined', () => {
      const userMetadata: UserMetadata = {
        first_name: 'Foo',
        last_name: 'Bar'
      };

      authService.userProfile = { user_metadata: userMetadata };
      expect(authService.getUserMetadata()).toEqual(userMetadata);
    });

    it('should return `undefined` if user\'s metadata is not defined', () => {
      authService.userProfile = undefined;

      expect(authService.getUserMetadata()).toBeUndefined();
    });
  });
});
