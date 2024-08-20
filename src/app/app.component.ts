import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PRLive-frontend';
  authService = new AuthService();
  loginButton = '';
  linkLog = '';

  ngOnInit() {
    this.authService
      .getWhoAmI()
      .then((res) => {
        if (res.code === 200) {
          this.loginButton = 'Logout';
          this.linkLog = environment.apiUrl + '/api/auth/logout';
        } else {
          this.loginButton = 'Login';
          this.linkLog = environment.apiUrl + '/api/auth/discord/login';
        }
      })
      .catch((err) => {
        this.loginButton = 'Login';
        this.linkLog = environment.apiUrl + '/api/auth/discord/login';
        console.error(err);
      });
  }
}
