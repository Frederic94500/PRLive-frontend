import { ApiService } from '../services/api.service';
import { IndexComponent } from './index/index.component';
import { Routes } from '@angular/router';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    resolve: { data: () => inject(ApiService).getWhoAmI },
    component: IndexComponent,
  },
];
