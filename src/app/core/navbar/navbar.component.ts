import { Component } from '@angular/core';

import { SidenavService } from '../sidenav/sidenav.service';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'ix-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private authService: AuthService,
              private sidenavService: SidenavService) { }

  /**
   * Determine if user is authenticated.
   * @returns {boolean} - `true` if user is authenticated; `false` otherwise.
   */
  isAuthenticated(): boolean {
    return this.authService.authenticated();
  }

  /**
   * Toggle sidenav event handler.
   */
  onToggleSidenav() {
    this.sidenavService.triggerToggle();
  }
}
