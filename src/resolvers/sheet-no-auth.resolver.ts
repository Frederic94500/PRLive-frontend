import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SheetService } from '@services/sheet.service';

@Injectable({
  providedIn: 'root'
})
export class SheetNoAuthResolver implements Resolve<any> {
  constructor(private sheetService: SheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const prId = route.paramMap.get('prId');
    const voterId = route.paramMap.get('voterId');
    const sheetId = route.paramMap.get('sheetId');
    return new Observable((observer) => {
      this.sheetService.getSheetNoAuth(prId!, voterId!, sheetId!).then((sheet) => {
        observer.next(sheet);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
