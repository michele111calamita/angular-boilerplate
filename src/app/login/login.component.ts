import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card" appearance="outlined">
        <h2 class="login-title">Accedi</h2>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" autocomplete="off">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Username</mat-label>
            <input
              matInput
              [(ngModel)]="username"
              name="username"
              required
              autocomplete="username"
              [disabled]="loading"
              #userInput="ngModel"
            />
            <mat-icon matSuffix *ngIf="userInput.valid && userInput.dirty">check_circle</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
              [disabled]="loading"
              #passInput="ngModel"
            />
            <mat-icon matSuffix *ngIf="passInput.valid && passInput.dirty">check_circle</mat-icon>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            class="full-width"
            type="submit"
            [disabled]="loginForm.invalid || loading"
          >
            <ng-container *ngIf="!loading; else loadingTpl">Accedi</ng-container>
            <ng-template #loadingTpl>
              <mat-progress-spinner
                diameter="24"
                mode="indeterminate"
                color="accent"
              ></mat-progress-spinner>
            </ng-template>
          </button>
        </form>

        <p class="error" *ngIf="errorMsg">
          <mat-icon>error</mat-icon> {{ errorMsg }}
        </p>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #1f1f2e, #2c2c3e);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px 24px;
      box-shadow: 0 8px 20px rgb(0 0 0 / 0.3);
      border-radius: 12px;
      color: #e0e0e0;
      background-color: #29293d;
    }

    .login-title {
      text-align: center;
      margin-bottom: 24px;
      font-weight: 600;
      color: #f5f5f5;
      font-size: 28px;
      letter-spacing: 1.2px;
    }

    .full-width {
      width: 100%;
    }

    button.full-width {
      margin-top: 20px;
      height: 48px;
      font-weight: 600;
      font-size: 16px;
    }

    mat-progress-spinner {
      margin: auto;
      display: block;
    }

    .error {
      margin-top: 16px;
      color: #ff5252;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';
  loading = false;
  apiUrl = 'http://localhost:3001/api/login';
  // URL del backend locale

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.loading) return;
    this.errorMsg = '';
    this.loading = true;

    this.http.post<{ token: string }>(this.apiUrl, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('auth_token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMsg = err?.error?.message || 'Credenziali non valide';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
