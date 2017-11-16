import { Injectable } from '@angular/core';
import { GameDataService } from '../gameData/game.data.service';
import { UserModel } from './user.model';
import { GameData } from '../gameData/game.data';

import * as firebase from 'firebase';

@Injectable()
export class UserService {

  constructor(public gameDataService: GameDataService, public userModel: UserModel) {
  }

  signIn(email: string, password: string): Promise<void> {
    return firebase.auth().signInWithEmailAndPassword(email, password).then((user: firebase.User) => {
      this.userModel.setCurrentUser(user);
    });
  }

  signOut(): Promise<void> {
    return firebase.auth().signOut().then(() => {
      this.userModel.setCurrentUser(null);
    });
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
    return this.gameDataService.addPlayerForUser(user);
  }
}
