import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UserModel } from './user/user.model';
import { UserService } from './user/user.service';

declare let $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  config = {
    apiKey: 'AIzaSyAJG85EJA1lBmYS31zcOqjSECZ2YSpWHxo',
    authDomain: 'strike3-31769.firebaseapp.com',
    databaseURL: 'https://strike3-31769.firebaseio.com/',
    storageBucket: 'strike3-31769'
  };

  user: firebase.User;

  constructor(public userModel: UserModel, public userService: UserService) {}

  ngOnInit(): void {
    $('body').foundation();
    firebase.initializeApp(this.config);
    this.userModel.init();

    this.userModel.currentUser$.subscribe((currentUser) => {
      this.user = currentUser;
    });
  }

  signOut() {
    this.userService.signOut();
  }
}
