import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-lista-utenti',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <mat-card class="card">
        <div class="flex w-full ">
          <img src="assets/logo.png" alt="Logo" class=" flex w-full" />
        </div>
        <h1 class="title">CREA LISTA TRASFERTE 40+</h1>

        <div *ngIf="error" class="error">{{ error }}</div>

        <button mat-raised-button color="primary" class="mb-3" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Chiudi Form' : 'Aggiungi Utente' }}
        </button>

        <form *ngIf="showForm" (ngSubmit)="addUser()" #userForm="ngForm">
          <mat-form-field class="field"><mat-label>Cognome</mat-label>
            <input matInput name="cognome" [(ngModel)]="newUser.cognome" required />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Nome</mat-label>
            <input matInput name="nome" [(ngModel)]="newUser.nome" required />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Data di nascita</mat-label>
            <input matInput name="dataNascita" [(ngModel)]="newUser.dataNascita" />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Luogo di nascita</mat-label>
            <input matInput name="luogoNascita" [(ngModel)]="newUser.luogoNascita" />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Codice fiscale</mat-label>
            <input matInput name="codiceFiscale" [(ngModel)]="newUser.codiceFiscale" required />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Numero tessera</mat-label>
            <input matInput name="numeroTessera" [(ngModel)]="newUser.numeroTessera" />
          </mat-form-field>
          <mat-form-field class="field"><mat-label>Codice sicurezza</mat-label>
            <input matInput name="codiceSicurezza" [(ngModel)]="newUser.codiceSicurezza" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.form.valid">
            Salva Utente
          </button>
        </form>

        <mat-divider class="divider"></mat-divider>

        <mat-form-field appearance="fill" class="field">
          <mat-label>Cerca</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Cerca..." />
        </mat-form-field>

        <div class="user-list-scroll">
          <div *ngFor="let user of filteredUsers(); trackBy: trackByUserId" class="user-item">
            <mat-checkbox
              [checked]="isSelected(user.id)"
              (change)="onCheckboxChange($event.checked, user.id)">
            </mat-checkbox>

            <div class="user-details">
              <div class="user-name">👤 {{ user.cognome }} {{ user.nome }}</div>
              <div class="user-meta">
                <div class="user-row">
                  <div><strong>📇 CF:</strong> {{ user.codiceFiscale }}</div>
                  <div><strong>🎂 Nascita:</strong> {{ user.dataNascita }}</div>
                  <div><strong>📍 Luogo:</strong> {{ user.luogoNascita }}</div>
                </div>
                <div class="user-row">
                  <div><strong>🪪 Tessera:</strong> {{ user.numeroTessera }}</div>
                  <div><strong>🔐 Sicurezza:</strong> {{ user.codiceSicurezza }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button mat-raised-button color="accent" class="export-btn"
                (click)="exportLista()" [disabled]="!selected.length">
          <mat-icon>download</mat-icon> Esporta Lista
        </button>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { width: 100vw; margin: 0; padding: 0; }
    .card { padding: 24px; background-color: black !important; color: white; }
    .logo-wrapper { text-align: center; }
    .logo-img { max-width: 200px; width: 100%; height: auto; }
    .title { text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
    .error { color: red; margin: 8px 0; }
    .field { display: block; margin-bottom: 12px; width: 100%; }
    .divider { margin: 16px 0; }
    .export-btn { margin-top: 12px; }
    .user-list-scroll { max-height: 400px; overflow-y: auto; padding-right: 8px; }
    .user-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #444;
      background-color: #121212;
      color: #eee;
    }
    .user-details { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .user-name { font-weight: 600; font-size: 18px; color: #fff; }
    .user-meta { display: flex; flex-direction: column; gap: 4px; }
    .user-row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 14px;
      color: #ccc;
    }
  `]
})
export class ListaUtentiComponent implements OnInit {
  users: any[] = [];
  selected: string[] = [];
  error = '';
  searchTerm = '';
  showForm = false;
  userIdCounter = 0;

  newUser = {
    cognome: '', nome: '', dataNascita: '', luogoNascita: '',
    codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
  };

  ngOnInit(): void {
    fetch('assets/utenti_precaricati.xlsx')
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);

        this.users = (data as any[]).map((row: any) => ({
          id: this.userIdCounter++,
          cognome: row['Cognome'] || '',
          nome: row['Nome'] || '',
          dataNascita: row['Data di nascita'] || '',
          luogoNascita: row['Luogo di nascita'] || '',
          codiceFiscale: row['Codice fiscale'] || '',
          numeroTessera: row['Numero tessera'] || '',
          codiceSicurezza: row['Codice sicurezza'] || ''
        }));
      })
      .catch(err => {
        console.error('Errore nel caricamento Excel:', err);
        this.error = 'Impossibile caricare il file utenti_precaricati.xlsx';
      });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addUser() {
    this.users.push({
      id: this.userIdCounter++,
      ...this.newUser
    });
    this.newUser = {
      cognome: '', nome: '', dataNascita: '', luogoNascita: '',
      codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
    };
    this.showForm = false;
  }

  onCheckboxChange(checked: boolean, id: number) {
    if (checked) {
      this.selected.push(String(id));
    } else {
      this.selected = this.selected.filter(s => s !== String(id));
    }
  }

  isSelected(id: number): boolean {
    return this.selected.includes(String(id));
  }

  trackByUserId(index: number, item: any): number {
    return item.id;
  }

  filteredUsers(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      user.cognome.toLowerCase().includes(term) ||
      user.nome.toLowerCase().includes(term) ||
      user.codiceFiscale.toLowerCase().includes(term)
    );
  }

  exportLista() {
    const lista = this.users.filter(u => this.selected.includes(String(u.id)));
    const ws = XLSX.utils.json_to_sheet(lista);
    ws['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 20 }, { wch: 15 }, { wch: 20 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ListaTrasferta');
    XLSX.writeFile(wb, 'lista_trasferta.xlsx');
  }
}
