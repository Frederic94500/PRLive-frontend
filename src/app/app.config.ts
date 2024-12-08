import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { ApiService } from '@services/api.service';
import { AuthGuard } from '@guards/auth.guard';
import { AuthService } from '@services/auth.service';
import { NominationService } from '../services/nomination.service';
import { PRService } from '@services/pr.service';
import { SheetService } from '@services/sheet.service';
import { UserService } from '../services/user.service';
import { UsersResolver } from '../resolvers/users.resolver';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from '@components/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    ApiService,
    AuthService,
    PRService,
    SheetService,
    AuthGuard,
    UsersResolver,
    UserService,
    NominationService,
  ],
};
