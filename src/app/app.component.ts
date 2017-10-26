import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  config= {
    apiKey: 'AIzaSyAJG85EJA1lBmYS31zcOqjSECZ2YSpWHxo',
    authDomain: 'strike3-31769.firebaseapp.com',
    databaseURL: 'https://strike3-31769.firebaseio.com/',
    storageBucket: 'strike3-31769'
  };

  ngOnInit(): void {
    firebase.initializeApp(this.config);
  }
}
