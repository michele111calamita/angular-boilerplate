import { Component, OnInit } from '@angular/core';
// Update the import path to the correct location of AuthService
import { AuthService } from './services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { ImportUtentiComponent } from './import-utenti/import-utenti.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { DashboardComponent } from "./dashboard/dashboard.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ImportUtentiComponent, UserManagerComponent, DashboardComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-test';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
