import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  luogoNascita: string;
  codiceFiscale: string;
  numeroTessera: string;
  codiceSicurezza: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(user => ({
        id: user.id,
        nome: user.nome || '',
        cognome: user.cognome || '',
        dataNascita: user.data_nascita || '',
        luogoNascita: user.citta || '',
        codiceFiscale: user.codice_fiscale || '',
        numeroTessera: user.id?.toString() || '',
        codiceSicurezza: ''
      })))
    );
  }
}
