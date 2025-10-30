import { Component, signal } from '@angular/core';
import { Header } from "./headers/header/header";
import { RouterModule } from '@angular/router';
import { CustomerUniqueName } from './directives/customer/customer-unique-name';

@Component({
  selector: 'app-root',
  imports: [Header, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SalesOrder');
}
