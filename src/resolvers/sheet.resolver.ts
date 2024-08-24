import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SheetService } from '@services/sheet.service';

@Injectable({
  providedIn: 'root'
})
export class SheetResolver implements Resolve<any> {
  constructor(private sheetService: SheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    return new Observable((observer) => {
      this.sheetService.getSheet(id!).then((sheet) => {
        observer.next(sheet);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
