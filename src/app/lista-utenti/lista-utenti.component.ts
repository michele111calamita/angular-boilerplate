import { Component } from '@angular/core';
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
    <div class="container">
      <mat-card class="card">
        <h1>📥 Importa Utenti da Excel</h1>

        <input type="file" (change)="onFileChange($event)" accept=".xlsx, .xls" />

        <div *ngIf="error" class="error">{{ error }}</div>

        <mat-form-field class="field" appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput [(ngModel)]="newUser.name" />
        </mat-form-field>

        <mat-form-field class="field" appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="newUser.email" />
        </mat-form-field>

        <button mat-flat-button color="primary" (click)="addUser()" [disabled]="!newUser.name || !newUser.email">
          Aggiungi Utente
        </button>

        <mat-divider class="divider"></mat-divider>

        <mat-list *ngIf="users.length">
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
    .divider { margin: 16px 0; }
    .export-btn { margin-top: 12px; }
    .field { width: 100%; margin-top: 12px; }
    .error { color: red; margin-top: 8px; }
  `]
})
export class ListaUtentiComponent {
  users: { name: string; email: string }[] = [];
  selected: { name: string; email: string }[] = [];
  newUser = { name: '', email: '' };
  error: string = '';

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
      const [header, ...rows] = data;
      const nameIdx = header.findIndex(h => h.toLowerCase().includes('nome') || h.toLowerCase().includes('name'));
      const emailIdx = header.findIndex(h => h.toLowerCase().includes('email'));

      if (nameIdx === -1 || emailIdx === -1) {
        this.error = 'Intestazioni non valide. Assicurati che il file contenga "Nome" e "Email"';
        return;
      }

      this.users = rows
        .filter(row => row[nameIdx] && row[emailIdx])
        .map(row => ({ name: row[nameIdx], email: row[emailIdx] }));
      this.error = '';
    };
    reader.readAsBinaryString(target.files[0]);
  }

  toggleSelection(user: any) {
    const idx = this.selected.findIndex(u => u.email === user.email);
    if (idx >= 0) this.selected.splice(idx, 1);
    else this.selected.push(user);
  }

  isSelected(user: any): boolean {
    return this.selected.some(u => u.email === user.email);
  }

  addUser() {
    this.users.push({ ...this.newUser });
    this.newUser = { name: '', email: '' };
  }

  exportLista() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.selected);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ListaTrasferta');
    XLSX.writeFile(wb, 'lista_trasferta.xlsx');
  }
}