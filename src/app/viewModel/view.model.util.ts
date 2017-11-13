import { Injectable } from '@angular/core';
import { PickModel } from '../pick/pick.model';
import { UserModel } from '../user/user.model';
import { Pick, PickStatus } from '../pick/pick';
import { GameDataModel } from '../gameData/game.data.model';
import { Player } from '../gameData/player';
import { Strike3Game, Strike3Pick, Strike3Player } from './strike3.game';
import { Week } from '../gameData/week';

@Injectable()
export class ViewModelUtil {

  constructor(public gameDataModel: GameDataModel, public pickModel: PickModel, public userModel: UserModel) {
  }

  buildViewModel(admin: boolean): Strike3Game {
    const currentUser = this.userModel.currentUser$.getValue();
    const allPlayers: Player[] = this.gameDataModel.allPlayers$.getValue();
    const week: Week = this.gameDataModel.week$.getValue();

    const strike3Game: Strike3Game = { players: [], week: week };

    if (allPlayers) {
      for (const player of allPlayers) {

        const strike3Player: Strike3Player = {
          name: player.name,
          picks: this._getStrike3PicksForPlayer(player, admin)
        };

        if (!admin) {
          strike3Player.signedIn = currentUser && player.uid === currentUser.uid
        }

        strike3Game.players.push(strike3Player);
      }
    }

    this._sortStrike3Players(strike3Game.players);

    return strike3Game;
  }

  private _getStrike3PicksForPlayer(player: Player, admin: boolean): Strike3Pick[] {
    const currentUser = this.userModel.currentUser$.getValue();
    const week: Week = this.gameDataModel.week$.getValue();
    const firstEditableWeek = week.locked ? week.weekNumber + 1 : week.weekNumber;

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
    const allPicks = admin ? this.pickModel.allPicksAdmin$.getValue() : this.pickModel.allPicks$.getValue();
    let sortedPicks: Pick[] = [];

    if (allPicks) {
      sortedPicks = allPicks.filter((currentPick) => {
        return currentPick.uid === player.uid;
      });

      this._addEmptyPicks(sortedPicks, player);
      this._sortPicks(sortedPicks);
    }

    return sortedPicks;
  }

  private _addEmptyPicks(picks: Pick[], player: Player) {
    for (let week = 1; week <= 17; week++) {
      const foundPick = picks.find((currentPick) => {
        return currentPick.week === week;
      });

      if (!foundPick) {
        picks.push({
          week: week,
          uid: player.uid,
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

  //TODO make this more advanced
  private _sortStrike3Players(strike3Players: Strike3Player[]) {
    strike3Players.sort((a, b): number => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
}
