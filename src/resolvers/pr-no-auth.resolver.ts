import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRService } from '@services/pr.service';

@Injectable({
  providedIn: 'root'
})
export class PRNoAuthResolver implements Resolve<any> {
  constructor(private prService: PRService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('prId');
    const voterId = route.paramMap.get('voterId');
    return new Observable((observer) => {
      this.prService.getPRNoAuth(id!, voterId!).then((pr) => {
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