import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagerComponent } from './user-manager/user-manager.component';


const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'user-manager',
    loadComponent: () => import('./user-manager/user-manager.component').then(m => m.UserManagerComponent)
  },
  {
    path: '',
    redirectTo: 'user-manager',
    pathMatch: 'full'
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
