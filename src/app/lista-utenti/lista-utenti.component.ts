import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container w-full p-0">
      <mat-card class="card">
      <div class="flex w-full h-full p-3 justify-content-center " >
  <img src="assets/logo.png" alt="Logo" class="w-full" />
</div>
        <h1 class="text-white font-bold text-center w-full">CREA LISTA TRASFERTE 40+</h1>

        <div *ngIf="error" class="error">{{ error }}</div>

        <form (ngSubmit)="addUser()" #userForm="ngForm">
          <mat-form-field class="field" appearance="fill">
            <mat-label>Cognome</mat-label>
            <input matInput [(ngModel)]="newUser.cognome" name="cognome" required />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Nome</mat-label>
            <input matInput [(ngModel)]="newUser.nome" name="nome" required />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Data di nascita</mat-label>
            <input matInput [(ngModel)]="newUser.dataNascita" name="dataNascita" />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Luogo di nascita</mat-label>
            <input matInput [(ngModel)]="newUser.luogoNascita" name="luogoNascita" />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Codice fiscale</mat-label>
            <input matInput [(ngModel)]="newUser.codiceFiscale" name="codiceFiscale" required />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Numero tessera</mat-label>
            <input matInput [(ngModel)]="newUser.numeroTessera" name="numeroTessera" />
          </mat-form-field>
          <mat-form-field class="field" appearance="fill">
            <mat-label>Codice sicurezza</mat-label>
            <input matInput [(ngModel)]="newUser.codiceSicurezza" name="codiceSicurezza" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.form.valid">Aggiungi Utente</button>
        </form>

        <mat-divider class="divider"></mat-divider>

        <mat-list-item *ngFor="let user of users" class="user-item">
  <mat-checkbox (change)="toggleSelection(user)" [checked]="isSelected(user)">
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
  </mat-checkbox>
</mat-list-item>



        <button mat-raised-button color="accent" class="export-btn"
                (click)="exportLista()" [disabled]="!selected.length">
          <mat-icon>download</mat-icon> Esporta Lista
        </button>
      </mat-card>
    </div>
  `,
  styles: [
    `.container { width:100svw; margin: 0px; padding: 0px; }
     .card { padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
     .divider { margin: 16px 0; }
     .export-btn { margin-top: 12px; }
     .error { color: red; margin-top: 8px; }
     .field { display: block; margin-bottom: 12px; width: 100%; }
     .user-item {
    padding: 16px;
    border-bottom: 1px solid #444;
    background-color: #121212;
    color: #eee;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .user-name {
    font-weight: 600;
    font-size: 18px;
    color: #fff;
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .user-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 14px;
    color: #ccc;
  }

::ng-deep .mat-mdc-card{
  background-color: black !important;
}


  mat-checkbox .mat-checkbox-label {
    color: inherit;
  }
     
     `

     
  ]
})
export class ListaUtentiComponent implements OnInit {
  users: any[] = [];
  selected: any[] = [];
  error: string = '';
  newUser: any = {
    cognome: '', nome: '', dataNascita: '', luogoNascita: '',
    codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
  };

  ngOnInit(): void {
    fetch('assets/utenti_precaricati.xlsx')
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        const wb: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        this.users = data.map((row: any) => ({
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

  toggleSelection(user: any) {
    const idx = this.selected.findIndex(u => u.codiceFiscale === user.codiceFiscale);
    if (idx >= 0) this.selected.splice(idx, 1);
    else this.selected.push(user);
  }

  isSelected(user: any): boolean {
    return this.selected.some(u => u.codiceFiscale === user.codiceFiscale);
  }

  addUser() {
    this.users.push({ ...this.newUser });
    this.newUser = {
      cognome: '', nome: '', dataNascita: '', luogoNascita: '',
      codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
    };
  }

  exportLista() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.selected);
  
    // Imposta larghezza colonne per leggibilità
    const columnWidths = [
      { wch: 15 }, // Cognome
      { wch: 15 }, // Nome
      { wch: 15 }, // Data di nascita
      { wch: 20 }, // Luogo di nascita
      { wch: 20 }, // Codice fiscale
      { wch: 15 }, // Numero tessera
      { wch: 20 }, // Codice sicurezza
    ];
    ws['!cols'] = columnWidths;
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ListaTrasferta');
    XLSX.writeFile(wb, 'lista_trasferta.xlsx');
  }
  
}
