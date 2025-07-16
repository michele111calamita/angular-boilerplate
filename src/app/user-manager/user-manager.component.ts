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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-user-manager',
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
    MatDividerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    HttpClientModule
  ],
  template: `
  <div *ngIf="loading" class="loading-container">
    <img src="assets/nicoloading.png" alt="Loading" class="loading-spinner" />
  </div>
  <div *ngIf="!loading">
    <div class="container">
      <mat-card class="card">
        <div class="w-full flex">
          <img src="assets/logo.png" alt="Logo" class="flex w-full" />
        </div>
        <h1 class="title">GESTIONE TRASFERTE 40+</h1>

        <!-- Error message -->
        <div *ngIf="error" class="error-message">{{ error }}</div>

        <!-- User Form Toggle Button -->
        <button mat-raised-button class="mb-3" color="primary" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : (editMode ? 'edit' : 'add') }}</mat-icon>
          {{ showForm ? 'Chiudi Form' : (editMode ? 'Modifica Utente' : 'Aggiungi Utente') }}
        </button>

        <!-- User Form -->
        <form *ngIf="showForm" (ngSubmit)="addOrUpdateUser()" #userForm="ngForm" class="user-form">
          <div class="form-columns">
            <div class="form-column">
              <mat-form-field><mat-label>Cognome</mat-label>
                <input matInput name="cognome" [(ngModel)]="newUser.cognome" required />
              </mat-form-field>
              <mat-form-field><mat-label>Nome</mat-label>
                <input matInput name="nome" [(ngModel)]="newUser.nome" required />
              </mat-form-field>
              <mat-form-field><mat-label>Data di nascita</mat-label>
                <input matInput name="dataNascita" [(ngModel)]="newUser.dataNascita" />
              </mat-form-field>
              <mat-form-field><mat-label>Luogo di nascita</mat-label>
                <input matInput name="luogoNascita" [(ngModel)]="newUser.luogoNascita" />
              </mat-form-field>
            </div>
            <div class="form-column">
              <mat-form-field><mat-label>Codice fiscale</mat-label>
                <input matInput name="codiceFiscale" [(ngModel)]="newUser.codiceFiscale" />
              </mat-form-field>
              <mat-form-field><mat-label>N° tessera</mat-label>
                <input matInput name="numeroTessera" [(ngModel)]="newUser.numeroTessera" />
              </mat-form-field>
              <mat-form-field><mat-label>Codice sicurezza</mat-label>
                <input matInput name="codiceSicurezza" [(ngModel)]="newUser.codiceSicurezza" />
              </mat-form-field>
              <div class="form-actions">
                <button mat-raised-button type="submit" color="primary">
                  {{ editMode ? 'Aggiorna' : 'Aggiungi' }}
                </button>
                <button mat-button type="button" color="warn" (click)="resetForm()">
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </form>

        <!-- Trasferta Management -->
        <div class="trasferta-section">
          <div class="trasferta-header">
            <h2>Gestione Trasferte</h2>
            <div class="trasferta-actions">
              <mat-form-field>
                <mat-label>Seleziona trasferta</mat-label>
                <mat-select [(ngModel)]="activeTrasferta">
                  <mat-option [value]="">-- Seleziona --</mat-option>
                  <mat-option *ngFor="let trasferta of trasferte" [value]="trasferta">
                    {{ trasferta }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-icon-button color="warn" *ngIf="activeTrasferta" 
                     (click)="deleteTrasferta()" matTooltip="Elimina trasferta">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <div class="add-trasferta">
            <mat-form-field>
              <mat-label>Nuova trasferta</mat-label>
              <input matInput [(ngModel)]="newTrasfertaName" placeholder="Nome trasferta" />
            </mat-form-field>
            <button mat-raised-button color="accent" (click)="addTrasferta()" [disabled]="!newTrasfertaName.trim()">
              <mat-icon>add</mat-icon> Crea
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
          <mat-form-field class="w-full">
            <mat-label>Cerca utenti</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Nome, cognome o codice fiscale" />
            <button *ngIf="searchTerm" matSuffix mat-icon-button aria-label="Clear" (click)="searchTerm=''">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- Users List -->
        <div class="users-container">
          <div *ngFor="let user of filteredUsers; trackBy: trackByUserId" class="user-item">
            <div class="user-selection">
              <mat-checkbox *ngIf="activeTrasferta" 
                          [checked]="isUserInTrasferta(user.id)" 
                          (change)="toggleUserInTrasferta($event.checked, user.id)">
              </mat-checkbox>
            </div>

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
              <button mat-icon-button color="accent" (click)="editUser(user)" matTooltip="Modifica">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user.id)" matTooltip="Elimina">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <!-- No users message -->
          <div *ngIf="filteredUsers.length === 0" class="no-users">
            Nessun utente trovato
          </div>
        </div>

        <!-- Export Button -->
        <button mat-raised-button color="accent" class="export-btn"
                (click)="exportLista()" [disabled]="!activeTrasferta || !hasSelectedUsers()">
          <mat-icon>download</mat-icon> Esporta Lista
        </button>
      </mat-card>
    </div>
  </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      padding: 20px;
      border-radius: 8px;
    }
    
    .title {
      text-align: center;
      margin: 20px 0;
      font-size: 24px;
      font-weight: bold;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    
    .loading-spinner {
      width: 100px;
      height: 100px;
      animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .user-form {
      margin-bottom: 20px;
      padding: 15px;
      background-color: rgba(0,0,0,0.05);
      border-radius: 8px;
    }
    
    .form-columns {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .form-column {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    .trasferta-section {
      margin: 20px 0;
      padding: 15px;
      background-color: rgba(0,0,0,0.05);
      border-radius: 8px;
    }
    
    .trasferta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .trasferta-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .add-trasferta {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .search-bar {
      margin: 20px 0;
    }
    
    .users-container {
      margin: 20px 0;
      max-height: 600px;
      overflow-y: auto;
    }
    
    .user-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      background-color: rgba(0,0,0,0.03);
      transition: background-color 0.2s;
    }
    
    .user-item:hover {
      background-color: rgba(0,0,0,0.07);
    }
    
    .user-selection {
      margin-right: 15px;
    }
    
    .user-details {
      flex: 1;
    }
    
    .user-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .user-meta {
      font-size: 14px;
    }
    
    .user-row {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 5px;
    }
    
    .actions {
      display: flex;
      gap: 5px;
    }
    
    .export-btn {
      margin-top: 20px;
      width: 100%;
    }
    
    .no-users {
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: rgba(0,0,0,0.5);
    }
    
    @media (max-width: 768px) {
      .form-columns {
        flex-direction: column;
      }
      
      .trasferta-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .trasferta-actions {
        width: 100%;
      }
      
      .user-row {
        flex-direction: column;
        gap: 5px;
      }
      
      .user-item {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .user-selection {
        margin-right: 0;
        margin-bottom: 10px;
      }
      
      .actions {
        margin-top: 10px;
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class UserManagerComponent implements OnInit {
  loading = true;
  users: User[] = [];
  filteredUsers: User[] = [];
  error = '';
  searchTerm = '';
  showForm = false;
  editMode = false;
  userIdCounter = 0;
  editingUserId: string | null = null;

  // Trasferte
  trasferte: string[] = [];
  trasferteUtenti: Record<string, string[]> = {};
  activeTrasferta: string = '';
  newTrasfertaName = '';

  // Nuovo utente o utente in modifica
  newUser: User = this.createEmptyUser();

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    
    // Carica dati localStorage esistenti
    this.loadFromLocalStorage();
    
    // Carica utenti dall'API
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.userIdCounter = this.users.reduce((max, u) => (Number(u.id) > max ? Number(u.id) : max), 0) + 1;
        this.loading = false;
        this.applySearchFilter();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento utenti dal server';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createEmptyUser(): User {
    return {
      id: 0,
      nome: '',
      cognome: '',
      dataNascita: '',
      luogoNascita: '',
      codiceFiscale: '',
      numeroTessera: '',
      codiceSicurezza: ''
    };
  }

  loadFromLocalStorage(): void {
    // Carica le trasferte
    const storedTrasferte = localStorage.getItem('trasferte');
    const storedMap = localStorage.getItem('trasferteUtenti');

    if (storedTrasferte) this.trasferte = JSON.parse(storedTrasferte);
    if (storedMap) this.trasferteUtenti = JSON.parse(storedMap);
  }

  saveToLocalStorage(): void {
    localStorage.setItem('trasferte', JSON.stringify(this.trasferte));
    localStorage.setItem('trasferteUtenti', JSON.stringify(this.trasferteUtenti));
  }

  applySearchFilter(): void {
    const search = this.searchTerm.toLowerCase().trim();
    if (!search) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    this.filteredUsers = this.users.filter(user => 
      user.nome?.toLowerCase().includes(search) || 
      user.cognome?.toLowerCase().includes(search) || 
      user.codiceFiscale?.toLowerCase().includes(search)
    );
  }

  toggleForm(): void {
    if (this.showForm) {
      this.resetForm();
    } else {
      this.showForm = true;
    }
  }

  resetForm(): void {
    this.newUser = this.createEmptyUser();
    this.editMode = false;
    this.showForm = false;
    this.editingUserId = null;
  }

  addOrUpdateUser(): void {
    if (!this.newUser.nome || !this.newUser.cognome) {
      this.showNotification('Nome e cognome sono obbligatori', 'error');
      return;
    }

    if (this.editMode && this.editingUserId !== null) {
      // Aggiornamento utente esistente
      const index = this.users.findIndex(u => String(u.id) === String(this.editingUserId));
      if (index !== -1) {
        this.users[index] = { ...this.newUser, id: Number(this.editingUserId) };
        this.showNotification('Utente aggiornato con successo', 'success');
      }
    } else {
      // Aggiunta nuovo utente
      const newUser = { ...this.newUser, id: this.userIdCounter++ };
      this.users.push(newUser);
      this.showNotification('Utente aggiunto con successo', 'success');
    }

    this.saveToLocalStorage();
    this.resetForm();
    this.applySearchFilter();
  }

  editUser(user: User): void {
    this.newUser = { ...user };
    this.editingUserId = String(user.id);
    this.editMode = true;
    this.showForm = true;
  }

  deleteUser(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      this.users = this.users.filter(u => Number(u.id) !== id);
      
      // Rimuovi l'utente da tutte le trasferte
      for (const trasfertaName in this.trasferteUtenti) {
        this.trasferteUtenti[trasfertaName] = this.trasferteUtenti[trasfertaName].filter(userId => userId !== String(id));
      }
      
      this.saveToLocalStorage();
      this.applySearchFilter();
      this.showNotification('Utente eliminato', 'success');
    }
  }

  // Trasferte
  addTrasferta(): void {
    if (this.newTrasfertaName.trim() && !this.trasferte.includes(this.newTrasfertaName)) {
      this.trasferte.push(this.newTrasfertaName);
      this.trasferteUtenti[this.newTrasfertaName] = [];
      this.activeTrasferta = this.newTrasfertaName;
      this.newTrasfertaName = '';
      this.saveToLocalStorage();
      this.showNotification('Trasferta creata', 'success');
    }
  }

  deleteTrasferta(): void {
    if (this.activeTrasferta && confirm('Sei sicuro di voler eliminare questa trasferta?')) {
      const index = this.trasferte.indexOf(this.activeTrasferta);
      if (index > -1) {
        this.trasferte.splice(index, 1);
        delete this.trasferteUtenti[this.activeTrasferta];
        this.activeTrasferta = '';
        this.saveToLocalStorage();
        this.showNotification('Trasferta eliminata', 'success');
      }
    }
  }

  toggleUserInTrasferta(checked: boolean, userId: number): void {
    if (!this.activeTrasferta) return;

    const list = this.trasferteUtenti[this.activeTrasferta] || [];

    if (checked) {
      if (!list.includes(userId.toString())) list.push(userId.toString());
    } else {
      this.trasferteUtenti[this.activeTrasferta] = list.filter(id => id !== userId.toString());
    }

    this.saveToLocalStorage();
  }

  isUserInTrasferta(userId: number): boolean {
    if (!this.activeTrasferta) return false;
    return (this.trasferteUtenti[this.activeTrasferta] || []).includes(userId.toString());
  }

  hasSelectedUsers(): boolean {
    if (!this.activeTrasferta) return false;
    return (this.trasferteUtenti[this.activeTrasferta] || []).length > 0;
  }

  exportLista(): void {
    if (!this.activeTrasferta) {
      this.showNotification('Nessuna trasferta selezionata', 'error');
      return;
    }
    
    const selectedUserIds = this.trasferteUtenti[this.activeTrasferta] || [];
    if (selectedUserIds.length === 0) {
      this.showNotification('Nessun utente selezionato per questa trasferta', 'error');
      return;
    }
    
    const selectedUsers = this.users
      .filter(user => selectedUserIds.includes(user.id.toString()))
      .sort((a, b) => a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(selectedUsers.map(user => ({
      'Cognome': user.cognome,
      'Nome': user.nome,
      'Data di Nascita': user.dataNascita,
      'Luogo di Nascita': user.luogoNascita,
      'Codice Fiscale': user.codiceFiscale,
      'N° Tessera': user.numeroTessera
    })));
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trasferta');
    
    // Generate Excel file
    const fileName = `Trasferta_${this.activeTrasferta}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    this.showNotification('Lista esportata con successo', 'success');
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  trackByUserId(index: number, item: User): string {
    return String(item.id);
  }
}
