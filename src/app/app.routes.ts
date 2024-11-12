import { AuthGuard } from '@guards/auth.guard';
import { AuthResolver } from '../resolvers/auth.resolver';
import { AuthService } from '@services/auth.service';
import { ErrorComponent } from '@components/error/error.component';
import { IndexComponent } from '@components/index/index.component';
import { LoginRedirectComponent } from '@components/login-redirect/login-redirect.component';
import { NominationComponent } from './nomination/nomination.component';
import { NominationResolver } from '../resolvers/nomination.resolver';
import { PRComponent } from '@components/pr/pr.component';
import { PRCreateComponent } from '@components/pr-create/pr-create.component';
import { PRDetailComponent } from '@components/pr-detail/pr-detail.component';
import { PREditComponent } from '@components/pr-edit/pr-edit.component';
import { PRFinishedComponent } from './pr-finished/pr-finished.component';
import { PRFinishedResolver } from '../resolvers/pr-finished.resolver';
import { PRGetEditResolver } from '../resolvers/pr-get-edit.resolver';
import { PROutputResolver } from '@resolvers/pr-output.resolver';
import { PRResolver } from '@resolvers/pr.resolver';
import { PRService } from '@services/pr.service';
import { ProfileComponent } from '@components/profile/profile.component';
import { Routes } from '@angular/router';
import { SheetComponent } from '@components/sheet/sheet.component';
import { SheetResolver } from '@resolvers/sheet.resolver';
import { SheetService } from '../services/sheet.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    resolve: {
      auth: AuthResolver,
    },
  },
  {
    path: 'login',
    component: LoginRedirectComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: 'pr',
    component: PRComponent,
    resolve: {
      auth: AuthResolver,
      prs: () => inject(PRService).getPRSimple(),
      sheets: () => inject(SheetService).getSheetSimple(),
    },
  },
  {
    path: 'pr/create',
    component: PRCreateComponent,
    canActivate: [() => inject(AuthGuard).protectedRoute()],
    resolve: {
      auth: AuthResolver,
    },
  },
  {
    path: 'pr/:id',
    component: PRDetailComponent,
    canActivate: [() => inject(AuthGuard).protectedRoute()],
    resolve: {
      auth: AuthResolver,
      pr: PROutputResolver,
    },
  },
  {
    path: 'pr/:id/edit',
    component: PREditComponent,
    canActivate: [() => inject(AuthGuard).protectedRoute()],
    resolve: {
      auth: AuthResolver,
      pr: PRGetEditResolver,
    },
  },
  {
    path: 'pr/:id/finished',
    component: PRFinishedComponent,
    resolve: {
      auth: AuthResolver,
      prFinished: PRFinishedResolver,
    },
  },
  {
    path: 'sheet/:id',
    component: SheetComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      sheet: SheetResolver,
      pr: PRResolver,
      auth: AuthResolver,
    },
  },
  {
    path: 'nomination/:id',
    component: NominationComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      nomination: NominationResolver,
      auth: AuthResolver,
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    resolve: {
      auth: AuthResolver,
    },
  },
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full',
  },
];
