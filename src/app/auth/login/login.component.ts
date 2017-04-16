import { Component } from '@angular/core';

import { AuthService } from '../shared/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  onLogin(): void {
    this.authService.login();
  }
}
