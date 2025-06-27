import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'pass') {
      localStorage.setItem('auth', 'true');
      this.router.navigate(['/']);
    } else {
      this.error = 'Credenziali errate';
    }
  }
}
