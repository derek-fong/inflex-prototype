import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Http403Component } from './http-403.component';
import { Http404Component } from './http-404.component';
import { Http500Component } from './http-500.component';
import { HttpStatusComponent } from './http-status.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HttpStatusComponent,
        children: [
          {
            path: '403',
            component: Http403Component
          }, {
            path: '404',
            component: Http404Component
          }, {
            path: '500',
            component: Http500Component
          }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class HttpStatusRoutingModule { }
