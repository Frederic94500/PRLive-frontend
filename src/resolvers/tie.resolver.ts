import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRService } from '../services/pr.service';

@Injectable({
  providedIn: 'root'
})
export class TieResolver implements Resolve<any> {
  constructor(private prService: PRService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    return new Observable((observer) => {
      this.prService.getTie(id!).then((tie) => {
        observer.next(tie);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
