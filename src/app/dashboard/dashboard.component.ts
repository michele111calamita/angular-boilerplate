import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserManagerComponent } from '../user-manager/user-manager.component';
import { ListaUtentiApiComponent } from '../lista-utenti-api/lista-utenti-api.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, UserManagerComponent, ListaUtentiApiComponent],
  template: `
    <!-- Usa il componente UserManager come predefinito -->
    <app-user-manager></app-user-manager>
    
    <!-- Pulsante per passare alla versione API -->
    <div class="floating-menu">
      <button mat-raised-button color="accent" (click)="navigateToListaApi()">
        Versione API
      </button>
    </div>
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
    .floating-menu {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}


  logout() {
    localStorage.removeItem('auth_token'); // 🔐 rimuove il token JWT
    this.router.navigate(['/login']);      // 🚪 torna alla login
  }
  
  navigateToListaApi() {
    this.router.navigate(['/lista-api']);
  }
}
