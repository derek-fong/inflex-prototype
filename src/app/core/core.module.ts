import {
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import {
  MdIconModule,
  MdListModule,
  MdSidenavModule,
  MdToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavService } from './sidenav/sidenav.service';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdToolbarModule,
    RouterModule,
    SharedModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    NavbarComponent,
    SidenavComponent
  ],
  providers: [ SidenavService ],
  exports: [
    BrowserModule,
    NavbarComponent,
    SharedModule,
    SidenavComponent,
    SimpleNotificationsModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
