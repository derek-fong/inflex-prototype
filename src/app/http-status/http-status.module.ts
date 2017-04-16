import { NgModule } from '@angular/core';

import { Http403Component } from './http-403.component';
import { Http404Component } from './http-404.component';
import { Http500Component } from './http-500.component';
import { HttpStatusComponent } from './http-status.component';
import { HttpStatusRoutingModule } from './http-status-routing.module';

@NgModule({
  imports: [ HttpStatusRoutingModule ],
  declarations: [
    Http403Component,
    Http404Component,
    Http500Component,
    HttpStatusComponent
  ],
})
export class HttpStatusModule { }
