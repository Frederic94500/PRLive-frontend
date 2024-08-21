import { environment } from '@environments/environment';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-login-redirect',
  standalone: true,
  imports: [],
  templateUrl: './login-redirect.component.html',
  styleUrl: './login-redirect.component.css'
})
export class LoginRedirectComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.location.href = environment.apiUrl + '/api/auth/discord/login';
  }
}
