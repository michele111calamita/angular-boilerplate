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
import { HttpClientModule } from '@angular/common/http';
import { UserService, User } from '../services/user.service';
import { TrasfertaService, TrasfertaResponse } from '../services/trasferta.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lista-utenti-api',
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
          <h1 class="title">CREA LISTA TRASFERTE 40+ (API Version)</h1>

          <div *ngIf="error" class="error">{{ error }}</div>
          <button mat-raised-button class="mb-3" color="primary" (click)="toggleForm()">
            <mat-icon>{{ showForm ? 'close' : (editMode ? 'edit' : 'add') }}</mat-icon>
            {{ showForm ? 'Chiudi Form' : (editMode ? 'Modifica Utente' : 'Aggiungi Utente') }}
          </button>

          <form *ngIf="showForm" (ngSubmit)="addOrUpdateUser()" #userForm="ngForm">
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
              <input matInput name="codiceFiscale" [(ngModel)]="newUser.codiceFiscale" />
            </mat-form-field>
            <mat-form-field class="field"><mat-label>N° tessera</mat-label>
              <input matInput name="numeroTessera" [(ngModel)]="newUser.numeroTessera" />
            </mat-form-field>
            <mat-form-field class="field"><mat-label>Codice sicurezza</mat-label>
              <input matInput name="codiceSicurezza" [(ngModel)]="newUser.codiceSicurezza" />
            </mat-form-field>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit">{{ editMode ? 'Aggiorna' : 'Aggiungi' }}</button>
              <button mat-button type="button" (click)="resetForm()">Annulla</button>
            </div>
          </form>

          <div class="trasferte-container mt-4">
            <div class="trasferte-header">
              <h2>Gestione Trasferte</h2>
              <div>
                <button mat-raised-button color="accent" (click)="toggleTrasfertaForm()">
                  {{ showTrasfertaForm ? 'Chiudi' : 'Nuova Trasferta' }}
                </button>
              </div>
            </div>

            <div *ngIf="showTrasfertaForm" class="trasferta-form">
              <mat-form-field class="field">
                <input matInput [(ngModel)]="newTrasfertaName" placeholder="Nome trasferta" />
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="addTrasferta()" [disabled]="!newTrasfertaName">
                Crea Trasferta
              </button>
            </div>

            <div class="trasferte-list">
              <div *ngFor="let trasferta of trasferte" 
                   class="trasferta-item" 
                   [class.active]="activeTrasferta === trasferta"
                   (click)="activeTrasferta = trasferta">
                {{ trasferta }}
                <button mat-icon-button color="warn" (click)="deleteTrasferta(trasferta); $event.stopPropagation();">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="search mt-4">
            <mat-form-field class="w-full">
              <input matInput [(ngModel)]="searchTerm" placeholder="Cerca..." (input)="applyFilter()" />
              <button mat-button *ngIf="searchTerm" matSuffix mat-icon-button aria-label="Clear" (click)="searchTerm=''; applyFilter()">
                <mat-icon>close</mat-icon>
              </button>
            </mat-form-field>
          </div>

          <div class="mt-4 export-actions">
            <button mat-raised-button color="primary" (click)="exportToExcel()" [disabled]="!hasSelectedUsers() || !activeTrasferta" class="mr-2">
              <mat-icon>description</mat-icon> Esporta Lista {{ activeTrasferta || '' }}
            </button>
            <button mat-raised-button color="accent" (click)="testApiCalls()" class="mr-2">
              <mat-icon>bug_report</mat-icon> Test API
            </button>
            <span *ngIf="activeTrasferta && !hasSelectedUsers()" class="warning">
              Nessun utente selezionato per la trasferta "{{ activeTrasferta }}"
            </span>
          </div>

          <div class="users-list mt-4">
            <div *ngFor="let user of filteredUsers" class="user-row">
              <div class="user-item">
                <div class="user-selection" *ngIf="activeTrasferta">
                  <mat-checkbox 
                    [checked]="isUserInTrasferta(user.id)" 
                    (change)="toggleUserInTrasferta($event.checked, user.id)">
                  </mat-checkbox>
                </div>
                <div class="user-info">
                  <div class="user-name">{{ user.cognome }} {{ user.nome }}</div>
                  <div class="user-details">
                    {{ user.dataNascita ? 'Nato il: ' + user.dataNascita : '' }}
                    {{ user.luogoNascita ? ' a ' + user.luogoNascita : '' }}
                  </div>
                  <div class="user-details" *ngIf="user.codiceFiscale">CF: {{ user.codiceFiscale }}</div>
                  <div class="user-details" *ngIf="user.numeroTessera">Tessera: {{ user.numeroTessera }}</div>
                </div>
                <div class="actions">
                  <button mat-icon-button color="primary" (click)="editUser(user)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
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

    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      padding: 20px;
    }

    .title {
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }

    .error {
      color: red;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #ffeeee;
      border-radius: 4px;
    }

    .field {
      margin-right: 10px;
      margin-bottom: 15px;
      width: 200px;
    }

    .form-actions {
      margin-top: 15px;
      margin-bottom: 20px;
    }

    .form-actions button {
      margin-right: 10px;
    }

    .search {
      margin-bottom: 15px;
    }

    .users-list {
      margin-top: 20px;
    }

    .user-row {
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .user-item {
      display: flex;
      align-items: center;
    }

    .user-selection {
      margin-right: 15px;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: bold;
      font-size: 16px;
    }

    .user-details {
      font-size: 14px;
      color: #666;
      margin-top: 3px;
    }

    .actions {
      display: flex;
    }

    .trasferte-container {
      margin-top: 20px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }

    .trasferte-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .trasferta-form {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .trasferta-form .field {
      margin-right: 15px;
      margin-bottom: 0;
    }

    .trasferte-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;
    }

    .trasferta-item {
      padding: 8px 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .trasferta-item.active {
      background-color: #e0f2f1;
      border: 1px solid #80cbc4;
    }

    .export-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    .warning {
      color: orange;
      margin-left: 15px;
    }

    .w-full {
      width: 100%;
    }

    .mb-3 {
      margin-bottom: 15px;
    }
    
    .mr-2 {
      margin-right: 8px;
    }

    .mt-4 {
      margin-top: 20px;
    }

    .flex {
      display: flex;
    }
  `]
})
export class ListaUtentiApiComponent implements OnInit {
  loading = true;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  showForm = false;
  editMode = false;
  userIdCounter = 1;
  editingUserId: number | null = null;
  error = '';
  
  // Trasferte
  trasferte: string[] = [];
  trasferteUtenti: Record<string, string[]> = {};
  activeTrasferta = '';
  showTrasfertaForm = false;
  newTrasfertaName = '';
  
  newUser: User = {
    id: 0,
    cognome: '', 
    nome: '', 
    dataNascita: '', 
    luogoNascita: '',
    codiceFiscale: '', 
    numeroTessera: '', 
    codiceSicurezza: ''
  };

  constructor(
    private userService: UserService,
    private trasfertaService: TrasfertaService
  ) {}
  ngOnInit() {
    this.loading = true;
    
    // Carica sia utenti che trasferte in parallelo
    forkJoin({
      users: this.userService.getUsers(),
      trasferte: this.trasfertaService.getTrasferte()
    }).subscribe({
      next: (data) => {
        this.users = data.users;
        this.filteredUsers = [...this.users];
        this.userIdCounter = this.users.reduce((max, u) => Math.max(max, Number(u.id)), 0) + 1;
        
        this.trasferte = data.trasferte.trasferte;
        this.trasferteUtenti = data.trasferte.trasferteUtenti;
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento dati:', err);
        this.error = 'Errore nel caricamento dati. Riprova più tardi.';
        this.loading = false;
      }
    });
  }

  // Funzioni per la gestione degli utenti
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm() {
    this.newUser = {
      id: 0,
      cognome: '',
      nome: '',
      dataNascita: '',
      luogoNascita: '',
      codiceFiscale: '',
      numeroTessera: '',
      codiceSicurezza: ''
    };
    this.editingUserId = null;
    this.editMode = false;
  }

  addOrUpdateUser() {
    if (!this.newUser.nome || !this.newUser.cognome) {
      this.error = 'Nome e cognome sono obbligatori';
      return;
    }

    if (this.editMode && this.editingUserId !== null) {
      // Aggiornamento utente
      const userToUpdate = { ...this.newUser, id: this.editingUserId };
      this.userService.updateUser(userToUpdate).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.resetForm();
          this.showForm = false;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Errore nell\'aggiornamento dell\'utente:', err);
          this.error = 'Errore nell\'aggiornamento dell\'utente';
        }
      });
    } else {
      // Creazione nuovo utente
      this.userService.createUser(this.newUser).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.resetForm();
          this.showForm = false;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Errore nella creazione dell\'utente:', err);
          this.error = 'Errore nella creazione dell\'utente';
        }
      });
    }
  }

  editUser(user: User) {
    this.newUser = { ...user };
    this.editingUserId = user.id;
    this.editMode = true;
    this.showForm = true;
  }

  deleteUser(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.applyFilter();
          
          // Rimuovi l'utente da tutte le trasferte
          for (const trasfertaName in this.trasferteUtenti) {
            this.trasferteUtenti[trasfertaName] = this.trasferteUtenti[trasfertaName].filter(
              userId => userId !== id.toString()
            );
          }
        },
        error: (err) => {
          console.error('Errore nell\'eliminazione dell\'utente:', err);
          this.error = 'Errore nell\'eliminazione dell\'utente';
        }
      });
    }
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.nome?.toLowerCase().includes(searchTerm) ||
      user.cognome?.toLowerCase().includes(searchTerm) ||
      user.codiceFiscale?.toLowerCase().includes(searchTerm)
    );
  }

  // Funzioni per la gestione delle trasferte
  toggleTrasfertaForm() {
    this.showTrasfertaForm = !this.showTrasfertaForm;
    if (!this.showTrasfertaForm) {
      this.newTrasfertaName = '';
    }
  }

  addTrasferta() {
    if (!this.newTrasfertaName.trim()) return;
    
    this.trasfertaService.createTrasferta(this.newTrasfertaName).subscribe({
      next: (response) => {
        if (!this.trasferte.includes(this.newTrasfertaName)) {
          this.trasferte.push(this.newTrasfertaName);
          this.trasferteUtenti[this.newTrasfertaName] = [];
        }
        this.activeTrasferta = this.newTrasfertaName;
        this.newTrasfertaName = '';
        this.showTrasfertaForm = false;
      },
      error: (err) => {
        console.error('Errore nella creazione della trasferta:', err);
        this.error = 'Errore nella creazione della trasferta';
      }
    });
  }

  deleteTrasferta(name: string) {
    if (!confirm(`Sei sicuro di voler eliminare la trasferta "${name}"?`)) return;
    
    this.trasfertaService.deleteTrasferta(name).subscribe({
      next: () => {
        this.trasferte = this.trasferte.filter(t => t !== name);
        delete this.trasferteUtenti[name];
        
        if (this.activeTrasferta === name) {
          this.activeTrasferta = '';
        }
      },
      error: (err) => {
        console.error('Errore nell\'eliminazione della trasferta:', err);
        this.error = 'Errore nell\'eliminazione della trasferta';
      }
    });
  }

  toggleUserInTrasferta(checked: boolean, userId: number) {
    if (!this.activeTrasferta) return;
    
    this.trasfertaService.toggleUserInTrasferta(this.activeTrasferta, userId, checked).subscribe({
      next: () => {
        const list = this.trasferteUtenti[this.activeTrasferta] || [];
        const userIdStr = userId.toString();
        
        if (checked) {
          if (!list.includes(userIdStr)) {
            list.push(userIdStr);
          }
        } else {
          this.trasferteUtenti[this.activeTrasferta] = list.filter(id => id !== userIdStr);
        }
      },
      error: (err) => {
        console.error('Errore nell\'aggiornamento della trasferta:', err);
        this.error = 'Errore nell\'aggiornamento della trasferta';
      }
    });
  }

  isUserInTrasferta(userId: number): boolean {
    if (!this.activeTrasferta) return false;
    const list = this.trasferteUtenti[this.activeTrasferta] || [];
    return list.includes(userId.toString());
  }

  hasSelectedUsers(): boolean {
    if (!this.activeTrasferta) return false;
    const list = this.trasferteUtenti[this.activeTrasferta] || [];
    return list.length > 0;
  }

  // Esportazione in Excel
  exportToExcel() {
    if (!this.activeTrasferta) {
      this.error = 'Nessuna trasferta selezionata';
      return;
    }
    
    const selectedIds = this.trasferteUtenti[this.activeTrasferta] || [];
    if (selectedIds.length === 0) {
      this.error = 'Nessun utente selezionato per questa trasferta';
      return;
    }
    
    const selectedUsers = this.users.filter(user => selectedIds.includes(user.id.toString()));
    const sortedUsers = [...selectedUsers].sort((a, b) => 
      a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome)
    );

    const worksheet = XLSX.utils.json_to_sheet(sortedUsers.map(user => ({
      'Cognome': user.cognome,
      'Nome': user.nome,
      'Data di Nascita': user.dataNascita,
      'Luogo di Nascita': user.luogoNascita,
      'Codice Fiscale': user.codiceFiscale,
      'Tessera': user.numeroTessera
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trasferta');
    
    const fileName = `Trasferta_${this.activeTrasferta}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
  
  // Funzione per testare le chiamate API e verificare che tutto funzioni correttamente
  testApiCalls() {
    this.error = '';
    console.log('Inizio test delle API...');
    
    // Test 1: Recupero utenti
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('✅ Test recupero utenti completato con successo:', users.length, 'utenti trovati');
        
        // Test 2: Recupero trasferte
        this.trasfertaService.getTrasferte().subscribe({
          next: (data) => {
            console.log('✅ Test recupero trasferte completato con successo:', 
              data.trasferte.length, 'trasferte trovate');
            
            // Test 3: Creazione di un utente di test
            const testUser: User = {
              id: 0,
              cognome: 'Test_' + Date.now(),
              nome: 'User_' + Math.floor(Math.random() * 1000),
              dataNascita: '2000-01-01',
              luogoNascita: 'Test City',
              codiceFiscale: 'TEST12345678901',
              numeroTessera: '',
              codiceSicurezza: ''
            };
            
            this.userService.createUser(testUser).subscribe({
              next: (createdUser) => {
                console.log('✅ Test creazione utente completato con successo:', createdUser);
                
                // Test 4: Aggiornamento dell'utente di test
                createdUser.cognome = createdUser.cognome + '_Updated';
                this.userService.updateUser(createdUser).subscribe({
                  next: (updatedUser) => {
                    console.log('✅ Test aggiornamento utente completato con successo:', updatedUser);
                    
                    // Test 5: Creazione di una trasferta di test
                    const testTrasferta = 'Test_Trasferta_' + Date.now();
                    this.trasfertaService.createTrasferta(testTrasferta).subscribe({
                      next: (createdTrasferta) => {
                        console.log('✅ Test creazione trasferta completato con successo:', createdTrasferta);
                        
                        // Test 6: Associazione utente-trasferta
                        this.trasfertaService.toggleUserInTrasferta(testTrasferta, createdUser.id, true).subscribe({
                          next: (toggleResult) => {
                            console.log('✅ Test associazione utente-trasferta completato con successo:', toggleResult);
                            
                            // Test 7: Rimozione associazione utente-trasferta
                            this.trasfertaService.toggleUserInTrasferta(testTrasferta, createdUser.id, false).subscribe({
                              next: (toggleRemoveResult) => {
                                console.log('✅ Test rimozione associazione utente-trasferta completato con successo:', toggleRemoveResult);
                                
                                // Test 8: Eliminazione trasferta di test
                                this.trasfertaService.deleteTrasferta(testTrasferta).subscribe({
                                  next: (deleteTrasfertaResult) => {
                                    console.log('✅ Test eliminazione trasferta completato con successo:', deleteTrasfertaResult);
                                    
                                    // Test 9: Eliminazione utente di test
                                    this.userService.deleteUser(createdUser.id).subscribe({
                                      next: () => {
                                        console.log('✅ Test eliminazione utente completato con successo');
                                        console.log('✅✅✅ Tutti i test completati con successo! ✅✅✅');
                                        
                                        alert('Test API completati con successo! Controlla la console per i dettagli.');
                                        // Aggiorna i dati dopo i test
                                        this.ngOnInit();
                                      },
                                      error: (err) => this.handleTestError('eliminazione utente', err)
                                    });
                                  },
                                  error: (err) => this.handleTestError('eliminazione trasferta', err)
                                });
                              },
                              error: (err) => this.handleTestError('rimozione associazione utente-trasferta', err)
                            });
                          },
                          error: (err) => this.handleTestError('associazione utente-trasferta', err)
                        });
                      },
                      error: (err) => this.handleTestError('creazione trasferta', err)
                    });
                  },
                  error: (err) => this.handleTestError('aggiornamento utente', err)
                });
              },
              error: (err) => this.handleTestError('creazione utente', err)
            });
          },
          error: (err) => this.handleTestError('recupero trasferte', err)
        });
      },
      error: (err) => this.handleTestError('recupero utenti', err)
    });
  }
  
  // Gestione errori test API
  private handleTestError(operation: string, error: any) {
    console.error(`❌ Test ${operation} fallito:`, error);
    this.error = `Errore nel test di ${operation}. Verifica la console per maggiori dettagli.`;
    alert(`Errore nel test di ${operation}. Verifica la console per maggiori dettagli.`);
  }
}
