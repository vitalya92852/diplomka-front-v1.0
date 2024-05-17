
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateInterface } from './platanus/auth/shared/types/appState.interface';
import { getCurrentUserAction } from './platanus/auth/store/actions/getCurrentUser.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private store:Store<AppStateInterface>){}
  ngOnInit(): void {
    this.store.dispatch(getCurrentUserAction())
  }

}
