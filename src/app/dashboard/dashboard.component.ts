import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ListaUtentiComponent } from "../lista-utenti/lista-utenti.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ListaUtentiComponent],
  template: `
    <!-- <div class="dashboard">
      <h2>Benvenuto nella Dashboard 🎉</h2>
      <p>Sei autenticato.</p>
      <button mat-raised-button color="warn" (click)="logout()">Logout</button>
      
    </div> -->
    <app-lista-utenti></app-lista-utenti>
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
