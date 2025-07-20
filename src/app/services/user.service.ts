import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TrasfertaService, TrasfertaResponse } from './trasferta.service';

export interface User {
  id: number;
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

  constructor(
    private http: HttpClient,
    private trasfertaService: TrasfertaService
  ) {}

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(user => ({
        id: user.id,
        nome: user.nome || '',
        cognome: user.cognome || '',
        dataNascita: user.dataNascita || '',
        luogoNascita: user.luogoNascita || '',
        codiceFiscale: user.codiceFiscale || '',
        numeroTessera: user.numeroTessera || user.id?.toString() || '',
        codiceSicurezza: user.codiceSicurezza || ''
      })))
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Wrapper per mantenere compatibilità con il componente lista-utenti
  // Delega la chiamata a TrasfertaService
  getTrasferte(): Observable<TrasfertaResponse> {
    return this.trasfertaService.getTrasferte();
  }
}
