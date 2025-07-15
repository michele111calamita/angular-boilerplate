import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  constructor(private http: HttpClient) {}

  get isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/login`, {
      username,
      password
    }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('auth_token', res.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }
}
