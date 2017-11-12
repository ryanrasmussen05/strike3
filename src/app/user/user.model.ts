import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

@Injectable()
export class UserModel {
  currentUser$: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);

  init() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setCurrentUser(user);
    });
  }

  setCurrentUser(user: firebase.User) {
    const currentUser = this.currentUser$.getValue();

    if (!this._sameUser(currentUser, user)) {
      console.log('set user');
      this.currentUser$.next(user);
    }
  }

  private _sameUser(userA: firebase.User, userB: firebase.User): boolean {
    if (userA === null && userB !== null) return false;
    if (userA !== null && userB === null) return false;
    if (userA === null && userB === null) return true;
    return userA.uid === userB.uid;
  }
}
