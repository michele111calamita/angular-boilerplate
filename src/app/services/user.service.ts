import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  data_nascita: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  codice_fiscale: string;
  note: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3003/api/users'; // Server locale

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
