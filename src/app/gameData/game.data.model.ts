import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Player } from './player';
import { Week } from './week';
import { GameData } from './game.data';
import { Pick } from './pick';

@Injectable()
export class GameDataModel {
  gameData$: BehaviorSubject<GameData> = new BehaviorSubject<GameData>(null);

  setGameData(gameData: GameData) {
    console.log('set game data');
    this.gameData$.next(gameData);
  }

  setWeek(week: Week) {
    console.log('set week');

    const gameData = this.gameData$.getValue();

    if (!gameData) return false;

    const updatedGameData = Object.create(gameData);
    updatedGameData.week = week;

    this.gameData$.next(updatedGameData);
  }

  addOrUpdatePick(pick: Pick, uid: string) {
    console.log('add pick');

    const updatedGameData: GameData = Object.create(this.gameData$.getValue());

    updatedGameData.players.get(uid).picks.set(pick.week, pick);

    this.gameData$.next(updatedGameData);
  }

  canAccessAdmin(uid: string): boolean {
    const gameData = this.gameData$.getValue();

    if (!gameData || !uid) return false;

    const foundPlayer = gameData.players.get(uid);

    if (!foundPlayer) return false;

    return foundPlayer.admin || foundPlayer.superuser;
  }
}
