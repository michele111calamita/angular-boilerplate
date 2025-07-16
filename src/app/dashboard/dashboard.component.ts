import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserManagerComponent } from '../user-manager/user-manager.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, UserManagerComponent],
  template: `
    <app-user-manager></app-user-manager>
  `,
  styles: [`
    .dashboard {
      text-align: center;
      margin-top: 100px;
      color: white;
    }
    h2 {
      margin-bottom: 16px;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}


  logout() {
    localStorage.removeItem('auth_token'); // 🔐 rimuove il token JWT
    this.router.navigate(['/login']);      // 🚪 torna alla login
  }
  
}
