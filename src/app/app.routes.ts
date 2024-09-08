import { ActivatedRoute, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { AuthService } from '@services/auth.service';
import { IndexComponent } from '@components/index/index.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { PRComponent } from '@components/pr/pr.component';
import { PRCreateComponent } from '@components/pr-create/pr-create.component';
import { PRDetailComponent } from '@components/pr-detail/pr-detail.component';
import { PROutputResolver } from '../resolvers/pr-output.resolver';
import { PRResolver } from '../resolvers/pr.resolver';
import { PRService } from '@services/pr.service';
import { ProfileComponent } from '@components/profile/profile.component';
import { SheetComponent } from '@components/sheet/sheet.component';
import { SheetResolver } from '@resolvers/sheet.resolver';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    resolve: { data: () => inject(AuthService).getWhoAmI() },
    component: IndexComponent,
  },
  {
    path: 'login',
    component: LoginRedirectComponent,
  },
  {
    path: 'pr',
    component: PRComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI(),
      prs: () => inject(PRService).getPRSimple(),
    },
  },
  {
    path: 'pr/create',
    component: PRCreateComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      auth: () => inject(AuthService).getWhoAmI(),
    },
  },
  {
    path: 'pr/:id',
    component: PRDetailComponent,
    resolve: {
      auth: () => inject(AuthService).getWhoAmI(),
      pr: PROutputResolver
    },
  },
  {
    path: 'sheet/:id',
    component: SheetComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      sheet: SheetResolver,
      pr: PRResolver,
      auth: () => inject(AuthService).getWhoAmI(),
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      auth: () => inject(AuthService).getWhoAmI(),
    },
  },
];
