import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Player } from './player';
import { PlayerModel } from './player.model';

require('firebase/firestore');

@Injectable()
export class PlayerService {

  constructor(public playerModel: PlayerModel) {
  }

  getAllPlayers(): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      const players = [];

      firebase.firestore().collection('players').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          players.push(doc.data());
        });
        this.playerModel.setPlayers(players);
        resolve(players);
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
