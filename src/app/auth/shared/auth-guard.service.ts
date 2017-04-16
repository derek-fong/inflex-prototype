import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(): boolean {
    const canActivate: boolean = this.authService.authenticated();

    if (!canActivate) {
      this.router.navigate(['/login']);
    }

    return canActivate;
  }
}
