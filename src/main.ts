import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
  [provideRouter(routes)]
]
});
