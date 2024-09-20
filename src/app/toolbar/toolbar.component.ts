import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent implements OnInit {
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
      });
  }
}
