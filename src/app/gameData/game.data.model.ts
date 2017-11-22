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

  getAvailableTeamsForPlayerAndWeek(uid: string, week: number): string[] {
    const teamsYetToPlay = this._filterTeamsForCurrentTime(week);
    const previousTeams = this._getPreviousTeamsForPlayer(uid, week);

    return teamsYetToPlay.filter((teamYetToPlay) => {
      const foundPreviousTeam = previousTeams.find((previousTeam) => {
        return previousTeam === teamYetToPlay;
      });

      return !foundPreviousTeam;
    });
  }

  private _filterTeamsForCurrentTime(week: number): string[] {
    const currentTime = new Date().getTime();
    const availableTeams: string[] = [];

    this.gameData$.getValue().schedule.get(week).forEach((currentNflGame) => {
      if (currentTime < currentNflGame.time) {
        availableTeams.push(currentNflGame.homeTeam, currentNflGame.awayTeam);
      }
    });

    return availableTeams;
  }

  private _getPreviousTeamsForPlayer(uid: string, week: number): string[] {
    const previousTeams: string[] = [];

    const playerPicks: Map<number, Pick> = this.gameData$.getValue().players.get(uid).picks;

    for (let index = 1; index < week; index++) {
      const pick = playerPicks.get(index);
      if (pick) {
        previousTeams.push(pick.team);
      }
    }

    return previousTeams;
  }
}
