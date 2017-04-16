import Auth0Lock from 'auth0-lock';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Rx';

import { AppMetadata } from './models/app-metadata.model';
import { Authorization } from './models/authorization.model';
import { UserMetadata } from './models/user-metadata.model';
import { UserProfile } from './models/user-profile.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  private lock: Auth0LockStatic;
  private userProfile: UserProfile;

  constructor(private router: Router) {
    this.lock = new Auth0Lock(environment.auth0Config.clientID, environment.auth0Config.domain, {
      auth: {
        params: {
          scope: 'openid permissions'
        },
        redirect: false
      }
    });

    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      this.lock.getProfile(authResult.idToken, (error: auth0.Auth0Error, userProfile: UserProfile) => {
        if (!error) {
          localStorage.setItem('user_profile', JSON.stringify(userProfile));
          this.userProfile = userProfile;
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/500']);
          throw error;
        }
      });
    });

    this.userProfile = JSON.parse(localStorage.getItem('user_profile'));
  }

  /**
   * Determine if user is authenticated.
   * @returns {boolean} - `true` if user is authenticated; `false` otherwise.
   */
  authenticated(): boolean {
    return tokenNotExpired();
  }

  /**
   * Invokes a [Meteor Method](https://docs.meteor.com/api/methods.html)
   * defined on the server, passing user's `id_token`, plus any number of arguments.
   * @param {string} name - Name of the method in the Meteor server.
   * @param {any} args - Parameters that will be forwarded to the method.
   * @returns {Observable<T>} - RxJS Observable, which completes when the server returns a response.
   */
  call$<T>(name: string, ...args: any[]): Observable<T> {
    const idToken: string = this.getIDToken();

    if (!name) {
      return Observable.throw({ error: 400, reason: 'Undefined call target. ' });
    }

    if (!idToken) {
      return Observable.throw({ error: 401, reason: 'Unauthorized. ' });  // TODO: Add types.
    }

    return MeteorObservable.call(name, idToken, ...args);
  }

  /**
   * Get current user's display name.
   * @returns {string} - Current user's display name.
   */
  getUserDisplayName(): string {
    let displayName: string = undefined;
    const fullName: string = this.getUserFullName();

    if (fullName) {
      displayName = fullName;
    } else {
      const email: string = this.getUserEmail();

      if (email) {
        displayName = email;
      } else {
        const userID: string = this.getUserID();

        if (userID) {
          displayName = userID;
        }
      }
    }
    return displayName;
  }

  /**
   * Get current user's email address.
   * @returns {string} - Current user's email address.
   */
  getUserEmail(): string {
    return this.hasProfileProperty('email') ? this.getUserProfile().email : undefined;
  }

  /**
   * Get current user's first name.
   * @returns {string} - Current user's first name.
   */
  getUserFirstName(): string {
    const userMetadata: UserMetadata = this.getUserMetadata();

    return userMetadata && userMetadata.first_name ? userMetadata.first_name : undefined;
  }

  /**
   * Get current user's full name.
   * @returns {string} - Current user's full name.
   */
  getUserFullName(): string {
    const userMetadata: UserMetadata = this.getUserMetadata();

    let fullName: string = undefined;

    if (userMetadata) {
      const firstName: string = userMetadata.first_name ? userMetadata.first_name : undefined;
      const lastName: string = userMetadata.last_name ? userMetadata.last_name : undefined;

      if (firstName && lastName) {
        fullName = `${firstName} ${lastName}`;
      }
    }
    return fullName;
  }

  /**
   * Get current user's ID.
   * @returns {string} - Current user's ID.
   */
  getUserID(): string {
    const userProfile: UserProfile = this.getUserProfile();

    return userProfile && userProfile.user_id ? userProfile.user_id : undefined;
  }

  /**
   * Get current user's last name.
   * @returns {string} - Current user's last name.
   */
  getUserLastName(): string {
    const userMetadata: UserMetadata = this.getUserMetadata();

    return userMetadata && userMetadata.last_name ? userMetadata.last_name : undefined;
  }

  /**
   * Login user.
   */
  login(): void {
    this.lock.show();
  }

  /**
   * Logout user.
   */
  logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_profile');
    this.userProfile = undefined;

    this.router.navigate(['/login']);
  }

  /**
   * Get current user's authorization.
   * @returns {Authorization} - Current user's authorization.
   */
  private getUserAuthorization(): Authorization {
    const appMetadata: AppMetadata = this.getUserAppMetadata();

    return appMetadata && Object.prototype.hasOwnProperty.call(appMetadata, 'authorization') ? appMetadata.authorization : undefined;
  }

  /**
   * Get current user's app metadata.
   * @returns {AppMetadata} - Current user's app metadata.
   */
  private getUserAppMetadata(): AppMetadata {
    return this.hasProfileProperty('app_metadata') ? this.getUserProfile().app_metadata : undefined;
  }

  /**
   * Get ID token.
   * @returns {string} - ID Token.
   */
  private getIDToken(): string {
    return localStorage.getItem('id_token');
  }

  /**
   * Get current user's metadata.
   * @returns {UserMetadata} - User's metadata.
   */
  private getUserMetadata(): UserMetadata {
    return this.hasProfileProperty('user_metadata') ? this.getUserProfile().user_metadata : undefined;
  }

  /**
   * Get current user's profile.
   * @returns {UserProfile} - Current user's profile.
   */
  private getUserProfile(): UserProfile {
    return this.userProfile;
  }

  /**
   * Determine if current user profile has property.
   * @param {string} property - Property name.
   * @returns {boolean} - `true` if current user profile has property; `false` otherwise.
   */
  private hasProfileProperty(property: string): boolean {
    const userProfile: UserProfile = this.getUserProfile();

    return userProfile && Object.prototype.hasOwnProperty.call(userProfile, property);
  }
}
