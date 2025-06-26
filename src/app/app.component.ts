import { Component } from '@angular/core';
import { ImportUtentiComponent } from './import-utenti/import-utenti.component';
import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports:[ImportUtentiComponent, ListaUtentiComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test';
}
