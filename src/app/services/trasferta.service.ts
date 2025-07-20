import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrasfertaResponse {
  trasferte: string[];
  trasferteUtenti: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class TrasfertaService {
  private apiUrl = `${environment.apiUrl}/api/trasferte`;

  constructor(private http: HttpClient) {}

  // Ottieni tutte le trasferte e le associazioni utente-trasferta
  getTrasferte(): Observable<TrasfertaResponse> {
    return this.http.get<TrasfertaResponse>(this.apiUrl);
  }

  // Crea una nuova trasferta
  createTrasferta(nome: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nome });
  }

  // Elimina una trasferta
  deleteTrasferta(nome: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${encodeURIComponent(nome)}`);
  }

  // Aggiunge o rimuove un utente da una trasferta
  toggleUserInTrasferta(trasferta: string, userId: number, add: boolean): Observable<any> {
    return this.http.patch<any>(this.apiUrl, {
      trasferta,
      userId,
      add
    });
  }
}
