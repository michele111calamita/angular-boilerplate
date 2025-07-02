import { Component } from '@angular/core';
import { ImportUtentiComponent } from './import-utenti/import-utenti.component';
import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';
import { Router, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ImportUtentiComponent, ListaUtentiComponent, DashboardComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test';
  constructor(private router: Router) {}

  ngOnInit() {
    const isAuth = localStorage.getItem('auth') === 'true';
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
  }
  
}
