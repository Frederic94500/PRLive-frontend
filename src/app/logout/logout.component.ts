import { environment } from '@/src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.location.href = environment.apiUrl + '/api/auth/logout';
  }
}
