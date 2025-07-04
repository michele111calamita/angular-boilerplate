import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  cognome: string;
  nome: string;
  dataNascita: string;
  luogoNascita: string;
  codiceFiscale: string;
  numeroTessera: string;
  codiceSicurezza: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://quarantapiu-be.vercel.app/api/users'; // o localhost

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
