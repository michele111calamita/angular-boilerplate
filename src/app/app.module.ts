import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { ImportUtentiComponent } from './import-utenti/import-utenti.component';
import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';

@NgModule({
  declarations: [
    AppComponent,
    ImportUtentiComponent,
    ListaUtentiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
