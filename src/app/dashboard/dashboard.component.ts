import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/shared/auth.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
   constructor(private authService: AuthService) { }

   ngOnInit(): void {
     this.authService.call$('auth:getSampleToken', 'Sample_token_header').subscribe(
       (token) => console.log(token),
       (error) => console.error(error)
     );
   }
}
