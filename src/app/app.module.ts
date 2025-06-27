import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

// import { AppComponent } from './app.component';
// import { ImportUtentiComponent } from './import-utenti/import-utenti.component';
// import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';

@NgModule({
  declarations: [
    // AppComponent,
    // ImportUtentiComponent,
    // ListaUtentiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
