import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    <div class="container">
      <mat-card class="card">
        <h1>👥 Gestione Utenti</h1>

        <form class="form" (ngSubmit)="addUser()" #f="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome</mat-label>
            <input matInput [(ngModel)]="newUser.name" name="name" required />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="newUser.email" name="email" required email />
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="f.invalid">
            <mat-icon>person_add</mat-icon> Aggiungi Utente
          </button>
        </form>

        <mat-divider class="divider"></mat-divider>

        <mat-list>
          <mat-list-item *ngFor="let user of users">
            <mat-checkbox (change)="toggleSelection(user)" [checked]="isSelected(user)">
              {{ user.name }} — {{ user.email }}
            </mat-checkbox>
          </mat-list-item>
        </mat-list>

        <button mat-raised-button color="accent" class="export-btn"
                (click)="exportLista()" [disabled]="!selected.length">
          <mat-icon>download</mat-icon> Esporta Lista
        </button>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: auto; padding: 16px; }
    .card { padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .full-width { width: 100%; }
    .divider { margin: 16px 0; }
    .export-btn { margin-top: 12px; }
  `]
})
export class ListaUtentiComponent implements OnInit {
  users: any[] = [];
  selected: any[] = [];
  newUser = { name: '', email: '' };

  ngOnInit() {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => this.users = data);
  }

  addUser() {
    if (!this.newUser.name || !this.newUser.email) return;
    this.users.push({ ...this.newUser });
    this.newUser = { name: '', email: '' };
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: this.users })
    });
  }

  toggleSelection(user: any) {
    const idx = this.selected.findIndex(u => u.email === user.email);
    if (idx >= 0) this.selected.splice(idx, 1);
    else this.selected.push(user);
  }

  isSelected(user: any): boolean {
    return this.selected.some(u => u.email === user.email);
  }

  exportLista() {
    fetch('/api/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: this.selected })
    }).then(async res => {
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'lista_trasferta.xlsx';
      a.click();
    });
  }
}
