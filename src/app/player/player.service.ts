import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Player } from './player';

require('firebase/firestore');

@Injectable()
export class PlayerService {

  getAllPlayers(): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      const players = [];

      firebase.firestore().collection('players').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          players.push(doc.data());
        });
        resolve(players);
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
