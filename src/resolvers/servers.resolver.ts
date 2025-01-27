import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerService } from '../services/server.service';

@Injectable({
  providedIn: 'root'
})
export class ServersResolver implements Resolve<any> {
  constructor(private serverService: ServerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return new Observable((observer) => {
      this.serverService.gets().then((pr) => {
        if (pr.code !== 200) {
          observer.error(pr);
          this.router.navigate(['/error'], { queryParams: { code: pr.code, message: pr.data } });
        }
        observer.next(pr);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
