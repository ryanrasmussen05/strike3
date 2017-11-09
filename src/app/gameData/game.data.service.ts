import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { GameDataModel } from './game.data.model';
import { Player } from './player';
import { Week } from './week';

require('firebase/firestore');

@Injectable()
export class GameDataService {

  GAME_DATA_COLLECTION_ID = 'gameData';
  PLAYERS_DOC_ID = 'players';
  WEEK_DOC_ID = 'week';

  constructor(public gameDataModel: GameDataModel) {
  }

  getGameData(): Promise<any> {
    return new Promise((resolve, reject) => {

      firebase.firestore().collection(this.GAME_DATA_COLLECTION_ID).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === this.PLAYERS_DOC_ID) {
            const playerMap: Map<string, Player> = <Map<string, Player>>doc.data();
            const players: Player[] = Object.keys(playerMap).map(key => playerMap[key]);
            this.gameDataModel.setPlayers(players);
          }
          if (doc.id === this.WEEK_DOC_ID) {
            this.gameDataModel.setWeek(<Week>doc.data());
          }
        });
        resolve();
      })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addPlayerForUser(user: firebase.User): Promise<void> {
    const userEntry = {};
    userEntry[user.uid] = {
      uid: user.uid,
      name: user.displayName
    };

    return firebase.firestore().collection(this.GAME_DATA_COLLECTION_ID).doc(this.PLAYERS_DOC_ID).set(userEntry, {merge: true});
  }
}
