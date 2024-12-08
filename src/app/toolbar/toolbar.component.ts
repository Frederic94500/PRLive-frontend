import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
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
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'discord',
      this.domSanitizer.bypassSecurityTrustResourceUrl('discord.svg')
    );

    this.authService
      .getWhoAmI()
      .then((res) => {
        if (res.code === 200) {
          this.logStatus = true;
          if (res.data.role === 'admin') {
            this.isAdmin = true;
          }
        } else {
        }
      })
      .catch(() => {});
  }
}
