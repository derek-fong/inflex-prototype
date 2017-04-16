import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/auth-guard.service';
import { NotAuthGuard } from './shared/not-auth-guard.service';

@NgModule({
  imports: [ AuthRoutingModule ],
  providers: [
    AuthGuard,
    AuthService,
    NotAuthGuard
  ],
  declarations: [ LoginComponent ]
})
export class AuthModule { }
