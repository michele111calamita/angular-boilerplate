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
 <div *ngIf="loading" class="loading-container">
    <img src="assets/nicoloading.png" alt="Loading" class="loading-spinner" />
  </div>
  <div *ngIf="!loading">
    <div class="container">
      <mat-card class="card">
        <div class="w-full flex ">
          <img src="assets/logo.png" alt="Logo" class="flex w-full" />
        </div>
        <h1 class="title">CREA LISTA TRASFERTE 40+</h1>

        <div *ngIf="error" class="error">{{ error }}</div>
        <button mat-raised-button class="mb-3" color="primary" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : (editMode ? 'edit' : 'add') }}</mat-icon>
          {{ showForm ? 'Chiudi Form' : (editMode ? 'Modifica Utente' : 'Aggiungi Utente') }}
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
            {{ editMode ? 'Salva Modifiche' : 'Aggiungi Utente' }}
          </button>
        </form>

        <button mat-raised-button color="accent" (click)="toggleTrasfertaForm()">
          <mat-icon>{{ showTrasfertaForm ? 'close' : 'add' }}</mat-icon>
          {{ showTrasfertaForm ? 'Chiudi Trasferta' : 'Nuova Trasferta' }}
        </button>
  
        <div *ngIf="showTrasfertaForm">
          <mat-form-field class="field">
            <mat-label>Nuova Trasferta</mat-label>
            <input matInput [(ngModel)]="newTrasfertaName" placeholder="Nome Trasferta" />
          </mat-form-field>
          <button mat-raised-button class="w-full" color="accent" (click)="addTrasferta()" [disabled]="!newTrasfertaName.trim()">
            <mat-icon>add</mat-icon> Aggiungi Trasferta
          </button>
        </div>

        <mat-form-field class="field my-3">
          <mat-label>Trasferta Attiva</mat-label>
          <select matNativeControl [(ngModel)]="activeTrasferta">
            <option *ngFor="let t of trasferte" [value]="t">{{ t }}</option>
          </select>
        </mat-form-field>

     

        <mat-form-field appearance="fill" class="field">
          <mat-label>Cerca</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Cerca..." />
        </mat-form-field>

        <div class="user-list-scroll">
          <div *ngFor="let user of filteredUsers(); trackBy: trackByUserId" class="user-item">
            <mat-checkbox
              [checked]="isUserInTrasferta(user.id)"
              (change)="toggleUserInTrasferta($event.checked, user.id)">
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

            <div class="actions">
              <button mat-icon-button color="accent" (click)="editUser(user)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <button mat-raised-button color="accent" class="export-btn"
                (click)="exportLista()" [disabled]="!activeTrasferta">
          <mat-icon>download</mat-icon> Esporta Lista
        </button>
      </mat-card>
    </div>
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
    .loading-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)); }
    .loading-spinner { width: 100px; animation: spin 2s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class ListaUtentiComponent implements OnInit {
  loading = true;
  users: any[] = [];
  selected: string[] = [];
  error = '';
  searchTerm = '';
  showForm = false;
  editMode = false;
  userIdCounter = 0;
  editingUserId: number | null = null;
  showTrasfertaForm = false;

  trasferte: string[] = [];
  trasferteUtenti: Record<string, string[]> = {};
  activeTrasferta: string = '';
  newTrasfertaName = '';

  newUser = {
    cognome: '', nome: '', dataNascita: '', luogoNascita: '',
    codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
  };

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);

    const savedUsers = localStorage.getItem('utenti');
    const savedSelected = localStorage.getItem('utentiSelezionati');
    const storedTrasferte = localStorage.getItem('trasferte');
    const storedMap = localStorage.getItem('trasferteUtenti');

    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
      this.userIdCounter = this.users.reduce((max, u) => u.id > max ? u.id : max, 0) + 1;
    }

    if (savedSelected) {
      this.selected = JSON.parse(savedSelected);
    }

    if (storedTrasferte) this.trasferte = JSON.parse(storedTrasferte);
    if (storedMap) this.trasferteUtenti = JSON.parse(storedMap);

    if (!savedUsers) {
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

          this.saveToLocalStorage();
        })
        .catch(err => {
          console.error('Errore nel caricamento Excel:', err);
          this.error = 'Impossibile caricare il file utenti_precaricati.xlsx';
        });
    }
  }

  addTrasferta() {
    if (this.newTrasfertaName.trim() && !this.trasferte.includes(this.newTrasfertaName)) {
      this.trasferte.push(this.newTrasfertaName);
      this.trasferteUtenti[this.newTrasfertaName] = [];
      this.activeTrasferta = this.newTrasfertaName;
      this.newTrasfertaName = '';
      this.saveToLocalStorage();
    }
  }

  toggleUserInTrasferta(checked: boolean, userId: number) {
    if (!this.activeTrasferta) return;
    const list = this.trasferteUtenti[this.activeTrasferta] || [];
    if (checked) {
      if (!list.includes(String(userId))) list.push(String(userId));
    } else {
      this.trasferteUtenti[this.activeTrasferta] = list.filter(id => id !== String(userId));
    }
    this.saveToLocalStorage();
  }

  isUserInTrasferta(userId: number): boolean | string {
    return this.activeTrasferta && this.trasferteUtenti[this.activeTrasferta]?.includes(String(userId));
  }

  saveToLocalStorage() {
    localStorage.setItem('utenti', JSON.stringify(this.users));
    localStorage.setItem('utentiSelezionati', JSON.stringify(this.selected));
    localStorage.setItem('trasferte', JSON.stringify(this.trasferte));
    localStorage.setItem('trasferteUtenti', JSON.stringify(this.trasferteUtenti));
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm() {
    this.newUser = {
      cognome: '', nome: '', dataNascita: '', luogoNascita: '',
      codiceFiscale: '', numeroTessera: '', codiceSicurezza: ''
    };
    this.editingUserId = null;
    this.editMode = false;
  }

  addUser() {
    if (this.editMode && this.editingUserId !== null) {
      const index = this.users.findIndex(u => u.id === this.editingUserId);
      if (index !== -1) {
        this.users[index] = { id: this.editingUserId, ...this.newUser };
      }
    } else {
      this.users.push({ id: this.userIdCounter++, ...this.newUser });
    }
    this.saveToLocalStorage();
    this.resetForm();
    this.showForm = false;
  }

  editUser(user: any) {
    this.newUser = { ...user };
    this.editingUserId = user.id;
    this.editMode = true;
    this.showForm = true;
  }

  deleteUser(id: number) {
    this.users = this.users.filter(u => u.id !== id);
    this.selected = this.selected.filter(s => s !== String(id));
    this.saveToLocalStorage();
  }

  onCheckboxChange(checked: boolean, id: number) {
    if (checked) {
      this.selected.push(String(id));
    } else {
      this.selected = this.selected.filter(s => s !== String(id));
    }
    this.saveToLocalStorage();
  }

  isSelected(id: number): boolean {
    return this.selected.includes(String(id));
  }

  trackByUserId(index: number, item: any): number {
    return item.id;
  }

  filteredUsers(): any[] {
    if (!this.searchTerm.trim()) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      String(user.cognome || '').toLowerCase().includes(term) ||
      String(user.nome || '').toLowerCase().includes(term) ||
      String(user.codiceFiscale || '').toLowerCase().includes(term) ||
      String(user.luogoNascita || '').toLowerCase().includes(term)
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
  toggleTrasfertaForm() {
    this.showTrasfertaForm = !this.showTrasfertaForm;
    if (!this.showTrasfertaForm) {
      this.newTrasfertaName = '';
    }
  }
}