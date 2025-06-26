import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-utenti',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  template: `
    <div class="container">
      <mat-card class="card">
        <h1>📥 Importa Utenti</h1>
        <div class="upload-area">
          <input type="file" id="file" (change)="onFileChange($event)" accept=".xlsx,.xls" hidden />
          <label for="file" class="upload-label">
            <mat-icon>upload</mat-icon>
            Scegli File Excel
          </label>
          <button mat-flat-button color="primary" (click)="saveToServer()" [disabled]="!importedUsers.length">
            <mat-icon>save</mat-icon> Salva Utenti
          </button>
        </div>
        <mat-list *ngIf="importedUsers.length">
          <mat-list-item *ngFor="let user of importedUsers">
            👤 {{ user.name }} — {{ user.email }}
          </mat-list-item>
        </mat-list>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: auto; padding: 16px; }
    .card { padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .upload-area { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .upload-label {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1976d2;
    }
  `]
})
export class ImportUtentiComponent {
  importedUsers: any[] = [];

  onFileChange(evt: any) {
    const target = <DataTransfer>evt.target;
    if (target.files.length !== 1) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      this.importedUsers = XLSX.utils.sheet_to_json(ws);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  saveToServer() {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: this.importedUsers })
    }).then(() => alert('Utenti salvati!'));
  }
}
