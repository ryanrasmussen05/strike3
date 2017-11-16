import { Injectable } from '@angular/core';
import { GameDataModel } from './game.data.model';
import { Week } from './week';
import { GameData } from './game.data';
import { Pick } from './pick';

import * as firebase from 'firebase';

@Injectable()
export class GameDataService {

  constructor(public gameDataModel: GameDataModel) {
  }

  getGameData(): Promise<GameData> {
    return firebase.database().ref('/').once('value').then((value: firebase.database.DataSnapshot) => {

      const serviceGameData: GameData = value.val();

      //we need to convert JS objects to ES6 Maps
      const gameData: GameData = {
        week: serviceGameData.week,
        players: this._buildMap(serviceGameData.players, false)
      };

      gameData.players.forEach((currentPlayer) => {
        currentPlayer.picks = this._buildMap(currentPlayer.picks, true);
      });

      this.gameDataModel.setGameData(gameData);

      return gameData;
    });
  }

  addPlayerForUser(user: firebase.User): Promise<any> {
    const userEntry = {
      name: user.displayName,
      uid: user.uid
    };

    return firebase.database().ref('players/' + user.uid).set(userEntry);
  }

  setWeek(week: Week): Promise<void> {
    return firebase.database().ref('week').set(week).then(() => {
      this.gameDataModel.setWeek(week);
    });
  }

  submitPick(pick: Pick, uid: string): Promise<void> {
    return firebase.database().ref('players/' + uid + '/picks/' + pick.week).set(pick).then(() => {
      this.gameDataModel.addOrUpdatePick(pick, uid);
    });
  }

  private _buildMap(obj, isKeyNumber: boolean) {
    const map = new Map();
    if (obj) {
      Object.keys(obj).forEach(key => {
        if (isKeyNumber) {
          map.set(parseInt(key), obj[key]);
        } else {
          map.set(key, obj[key]);
        }
      });
    }
    return map;
  }
}
