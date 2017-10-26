import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class UserService {

  signIn(email: string, password: string): Promise<firebase.User> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return firebase.auth().signOut();
  }

  createUser(email: string, password: string): Promise<firebase.User> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
}
