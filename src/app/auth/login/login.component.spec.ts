import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../shared/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    const authServiceStub = {
      login: () => undefined
    };

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [{ provide: AuthService, useValue: authServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLogin()', () => {
    it('should call AuthService `login()`', inject([AuthService], (authService: AuthService) => {
      const loginSpy = spyOn(authService, 'login');

      component.onLogin();

      expect(loginSpy).toHaveBeenCalled();
    }));
  });
});
