import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

require('firebase/firestore');

@Injectable()
export class UserService {

  signIn(email: string, password: string): Promise<firebase.User> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return firebase.auth().signOut();
  }

  createUser(email: string, displayName: string, password: string): Promise<void> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((user: firebase.User) => {
      return this.setUsername(user, displayName).then(() => {
        return this.addPlayerForUser(user);
      });
    });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  setUsername(user: firebase.User, name: string): Promise<void> {
    return user.updateProfile({displayName: name, photoURL: null});
  }

  addPlayerForUser(user: firebase.User): Promise<void> {
    return firebase.firestore().collection('players').doc(user.uid).set({
      uid: user.uid,
      name: user.displayName,
      admin: false
    });
  }
}
