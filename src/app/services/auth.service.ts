import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/login`, {
      username,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
