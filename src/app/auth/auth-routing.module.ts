import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NotAuthGuard } from './shared/not-auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [ NotAuthGuard ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule { }
