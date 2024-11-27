import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  logStatus = false;

  constructor(private authService: AuthService) {
    this.authService
      .getWhoAmI()
      .then((res) => {
        if (res.code === 200) {
          this.logStatus = true;
        } else {
        }
      })
      .catch(() => {});
  }
}
