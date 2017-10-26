import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { UserModel } from '../user/user.model';

const AuthError = {
  InvalidEmail: 'auth/invalid-email',
  NotFound: 'auth/user-not-found',
  IncorrectPassword: 'auth/wrong-password',
  EmailInUse: 'auth/email-already-in-use',
  WeakPassword: 'auth/weak-password'
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  AuthError = AuthError;

  email: string = 'ryanrasmussen05@gmail.com';
  password: string = '123456';
  error: any;

  constructor(public userModel: UserModel) {
    userModel.currentUser$.subscribe((user) => {
      console.log(user);
    });
  }

  login() {
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
      (success) => {
        //console.log(success);
      },
      (error: firebase.auth.Error) => {
        console.log(error);
        this.error = error.code;
      });
  }

  logout() {
    firebase.auth().signOut();
  }

  createUser() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
      (user: firebase.User) => {
        //console.log(user);
      },
      (error: firebase.auth.Error) => {
        console.log(error);
        this.error = error.code;
      });
  }

}
