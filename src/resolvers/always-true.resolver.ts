import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlwaysFalseResolver implements Resolve<boolean> {
  resolve(): Observable<boolean> {
    return of(false);
  }
}