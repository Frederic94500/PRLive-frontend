import { Observable, from } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<any> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<any> {
    return from(this.authService.getWhoAmI());
  }
}