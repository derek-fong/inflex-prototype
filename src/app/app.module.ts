import 'hammerjs';
import { NgModule } from '@angular/core';
import { MdSidenavModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HttpStatusModule } from './http-status/http-status.module';

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule,
    DashboardModule,
    HttpStatusModule,
    MdSidenavModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
