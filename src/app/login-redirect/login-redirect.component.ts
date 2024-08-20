import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';

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
    window.location.href = environment.apiUrl + '/api/auth/discord/login';
  }
}
