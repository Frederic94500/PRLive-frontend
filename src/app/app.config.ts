import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { ApiService } from '@services/api.service';
import { AuthGuard } from '@guards/auth.guard';
import { AuthService } from '@services/auth.service';
import { PRService } from '@services/pr.service';
import { SheetService } from '@services/sheet.service';
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
    ApiService,
    AuthService,
    PRService,
    SheetService,
    AuthGuard
  ],
};
