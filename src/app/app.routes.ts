import { ActivatedRoute, Routes } from '@angular/router';
import { Inject, inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { IndexComponent } from './index/index.component';
import { PRComponent } from './pr/pr.component';
import { PRCreateComponent } from './pr-create/pr-create.component';
import { PREditComponent } from './pr-edit/pr-edit.component';
import { PRListComponent } from './pr-list/pr-list.component';
import { PRService } from '../services/pr.service';
import { ProfileComponent } from './profile/profile.component';
import { SheetComponent } from './sheet/sheet.component';
import { SheetService } from '../services/sheet.service';

export const routes: Routes = [
  {
    path: '',
    resolve: { data: () => inject(AuthService).getWhoAmI },
    component: IndexComponent,
  },
  {
    path: 'pr',
    component: PRComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
      prs: () => inject(PRService).getPRSimple,
    },
  },
  {
    path: 'pr/create',
    component: PRCreateComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
    },
  },
  {
    path: 'pr/:id',
    component: PRListComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
      pr: () =>
        inject(PRService).getPR(inject(ActivatedRoute).snapshot.params['id']),
    },
  },
  {
    path: 'pr/:id/edit',
    component: PREditComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
      pr: () =>
        inject(PRService).getPR(inject(ActivatedRoute).snapshot.params['id']),
    },
  },
  {
    path: 'sheet/:id',
    component: SheetComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
      sheet: () =>
        inject(SheetService).getSheet(
          inject(ActivatedRoute).snapshot.params['id']
        ),
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI,
    },
  }
];
