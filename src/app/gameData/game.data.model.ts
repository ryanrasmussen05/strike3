import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Week } from './week';
import { GameData } from './game.data';
import { Pick } from './pick';
import { NFLGame } from './nfl.schedule';

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

  setNflSchedule(nflSchedule: Map<number, NFLGame[]>) {
    console.log('set schedule');

    const updatedGameData: GameData = Object.create(this.gameData$.getValue());
    updatedGameData.schedule = nflSchedule;

    this.gameData$.next(updatedGameData);
  }

  addOrUpdatePick(pick: Pick, uid: string) {
    console.log('add pick');

    const updatedGameData: GameData = Object.create(this.gameData$.getValue());

    const existingPick = updatedGameData.players.get(uid).picks.get(pick.week);

    if (existingPick) {
      Object.assign(existingPick, pick);
      updatedGameData.players.get(uid).picks.set(pick.week, existingPick);
    } else {
      updatedGameData.players.get(uid).picks.set(pick.week, pick);
    }

    this.gameData$.next(updatedGameData);
  }

  canAccessAdmin(uid: string): boolean {
    const gameData = this.gameData$.getValue();

    if (!gameData || !uid) return false;

    const foundPlayer = gameData.players.get(uid);

    if (!foundPlayer) return false;

    return foundPlayer.admin;
  }

  canAccessSuperuser(uid: string): boolean {
    const gameData = this.gameData$.getValue();

    if (!gameData || !uid) return false;

    const foundPlayer = gameData.players.get(uid);

    if (!foundPlayer) return false;

    return foundPlayer.superuser;
  }
}
