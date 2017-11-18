import { Injectable } from '@angular/core';
import { UserModel } from '../user/user.model';
import { GameDataModel } from '../gameData/game.data.model';
import { Player } from '../gameData/player';
import { Pick, PickStatus } from '../gameData/pick';
import { Strike3Game, Strike3Pick, Strike3Player } from './strike3.game';
import { GameData } from '../gameData/game.data';

@Injectable()
export class ViewModelUtil {

  constructor(public gameDataModel: GameDataModel, public userModel: UserModel) {
  }

  buildViewModel(admin: boolean): Strike3Game {
    const currentUser = this.userModel.currentUser$.getValue();
    const gameData: GameData = this.gameDataModel.gameData$.getValue();
    const strike3Game: Strike3Game = { players: [], week: null };

    if (!gameData) return strike3Game;

    strike3Game.week = gameData.week;

    gameData.players.forEach((player) => {
      const strike3Player: Strike3Player = {
        name: player.name,
        picks: this._getStrike3PicksForPlayer(player, admin),
        strikes: 0,
        admin: player.admin
      };

      strike3Player.strikes = this._getNumStrikesForPlayer(strike3Player);

      if (!admin) {
        strike3Player.signedIn = currentUser && player.uid === currentUser.uid;
      }

      strike3Game.players.push(strike3Player);
    });

    this._sortStrike3Players(strike3Game.players);

    return strike3Game;
  }

  private _getStrike3PicksForPlayer(player: Player, admin: boolean): Strike3Pick[] {
    const currentUser = this.userModel.currentUser$.getValue();
    const gameData: GameData = this.gameDataModel.gameData$.getValue();
    const firstEditableWeek = gameData.week.locked ? gameData.week.weekNumber + 1 : gameData.week.weekNumber;

    const strike3Picks: Strike3Pick[] = [];
    const picks: Pick[] = this._getPicksForPlayer(player, admin);

    for (const pick of picks) {
      let canEdit = currentUser && currentUser.uid === player.uid;
      canEdit = canEdit && pick.week >= firstEditableWeek;
      canEdit = canEdit && !pick.team;
      canEdit = canEdit || admin;

      const strike3Pick: Strike3Pick = {
        week: pick.week,
        team: pick.team,
        canEdit: canEdit,
        playerName: player.name,
        uid: player.uid,
        status: pick.status
      };

      strike3Picks.push(strike3Pick);
    }

    return strike3Picks;
  }

  private _getPicksForPlayer(player: Player, admin: boolean): Pick[] {
    const currentUser = this.userModel.currentUser$.getValue();
    const gameData: GameData = this.gameDataModel.gameData$.getValue();
    const lastViewableWeek = gameData.week.locked ? gameData.week.weekNumber : gameData.week.weekNumber - 1;

    let playerPicks: Pick[] = [];

    if (player.picks) {
      player.picks.forEach((currentPick) => {
        playerPicks.push(currentPick);
      });
    }

    const canViewAllPicks = admin || (currentUser && currentUser.uid === player.uid) || player.admin;

    if (!canViewAllPicks) {
      playerPicks = playerPicks.filter((currentPick) => {
        return currentPick.week <= lastViewableWeek;
      });
    }

    this._addEmptyPicks(playerPicks);
    this._sortPicks(playerPicks);

    return playerPicks;
  }

  private _addEmptyPicks(picks: Pick[]) {
    for (let week = 1; week <= 17; week++) {
      const foundPick = picks.find((currentPick) => {
        return currentPick.week === week;
      });

      if (!foundPick) {
        picks.push({
          week: week,
          status: PickStatus.Open
        });
      }
    }
  }

  private _sortPicks(picks: Pick[]) {
    picks.sort((a, b): number => {
      if (a.week < b.week) return -1;
      if (a.week > b.week) return 1;
      return 0;
    });
  }

  private _getNumStrikesForPlayer(strike3Player: Strike3Player): number {
    let numStrikes = 0;

    for (const strike3Pick of strike3Player.picks) {
      if (numStrikes >= 3) {
        strike3Pick.eliminated = true;
        strike3Pick.canEdit = false;
      }
      if (strike3Pick.status === PickStatus.Loss) {
        numStrikes++;
      }
    }

    return numStrikes;
  }

  private _sortStrike3Players(strike3Players: Strike3Player[]) {
    strike3Players.sort((a, b): number => {
      if (a.strikes < b.strikes) return -1;
      if (a.strikes > b.strikes) return 1;
      if (this._getEliminationWeek(a) > this._getEliminationWeek(b)) return -1;
      if (this._getEliminationWeek(a) < this._getEliminationWeek(b)) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  private _getEliminationWeek(strike3Player: Strike3Player): number {
    let eliminationWeek = 100;

    for (const strike3Pick of strike3Player.picks) {
      if (strike3Pick.eliminated) {
        eliminationWeek = strike3Pick.week;
        break;
      }
    }

    return eliminationWeek;
  }
}
