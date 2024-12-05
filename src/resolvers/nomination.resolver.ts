import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { NominationService } from '../services/nomination.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NominationResolver implements Resolve<any> {
  constructor(
    private nominationService: NominationService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    return new Observable((observer) => {
      this.nominationService
        .getNomination(id!)
        .then((nomination) => {
          if (nomination.code !== 200) {
            observer.error(nomination);
            this.router.navigate(['/error'], {
              queryParams: { code: nomination.code, message: nomination.data },
            });
          }
          observer.next(nomination);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
