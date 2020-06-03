import { Component, NgZone } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Warehouse Managment';
  
  constructor(private router: Router,
    private _ngZone: NgZone) {
  
    }
}
