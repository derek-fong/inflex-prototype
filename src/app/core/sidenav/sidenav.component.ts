import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { SidenavService } from './sidenav.service';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'ix-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenavElement;
  private sidenavToggleSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private sidenavService: SidenavService) { }

  ngOnInit(): void {
    this.sidenavToggleSub = this.sidenavService.toggle$.subscribe((triggerToggle: boolean) => {
      if (triggerToggle) {
        this.sidenavElement.toggle();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sidenavToggleSub) { this.sidenavToggleSub.unsubscribe(); }
  }

  /**
   * Get user display name.
   * @returns {string} - User display name.
   */
  getUserDisplayName(): string {
    return this.authService.getUserDisplayName();
  }

  /**
   * Determine if user is authenticated.
   * @returns {boolean} - `true` if user is authenticated; `false` otherwise.
   */
  isAuthenticated(): boolean {
    return this.authService.authenticated();
  }

  /**
   * Logout event handler.
   */
  onLogout(): void {
    this.sidenavElement.close();
    this.authService.logout();
  }

  /**
   * Navigate event handler.
   * @param {string} path - Path.
   */
  onNavigate(path: string): void {
    this.sidenavElement.close();
    this.router.navigate([path]);
  }
}
