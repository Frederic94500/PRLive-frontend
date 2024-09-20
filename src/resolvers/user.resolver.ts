import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return new Observable((observer) => {
      this.userService.getUsers().then((users) => {
        if (users.code !== 200) {
          observer.error(users);
          this.router.navigate(['/error'], { queryParams: { code: users.code, message: users.data } });
        }
        observer.next(users);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}

