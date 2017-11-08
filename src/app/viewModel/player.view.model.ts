import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PickModel } from '../pick/pick.model';
import { UserModel } from '../user/user.model';
import { Pick } from '../pick/pick';
import { GameDataModel } from '../gameData/game.data.model';
import { Player } from '../gameData/player';
import { Strike3Game, Strike3Pick, Strike3Player } from './strike3.game';

@Injectable()
export class PlayerViewModel {
  strike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);

  constructor(public gameDataModel: GameDataModel, public pickModel: PickModel, public userModel: UserModel) {
    gameDataModel.allPlayers$.subscribe(() => { this._buildGameModel(); });
    gameDataModel.week$.subscribe(() => { this._buildGameModel(); });
    pickModel.allPicks$.subscribe(() => { this._buildGameModel(); });
  }

  private _buildGameModel() {
    console.log('build player view model');

    const allPlayers: Player[] = this.gameDataModel.allPlayers$.getValue();

    const strike3Game: Strike3Game = { players: [] };

    if (allPlayers) {
      for (const player of allPlayers) {

        const strike3Player: Strike3Player = {
          name: player.name,
          picks: this._getStrike3PicksForPlayer(player)
        };

        strike3Game.players.push(strike3Player);
      }
    }

    this._sortStrike3Players(strike3Game.players);

    this.strike3Game$.next(strike3Game);
  }

  private _getStrike3PicksForPlayer(player: Player): Strike3Pick[] {
    const currentUser = this.userModel.currentUser$.getValue();

    const strike3Picks: Strike3Pick[] = [];
    const picks: Pick[] = this._getPicksForPlayer(player);

    for (const pick of picks) {
      const canEdit = currentUser && currentUser.uid === player.uid; //TODO check current week

      const strike3Pick: Strike3Pick = {
        week: pick.week,
        team: pick.team,
        canEdit: canEdit
      };

      if (pick.win !== undefined && pick.win !== null) {
        strike3Pick.win = pick.win;
      }

      strike3Picks.push(strike3Pick);
    }

    return strike3Picks;
  }

  private _getPicksForPlayer(player: Player): Pick[] {
    const allPicks = this.pickModel.allPicks$.getValue();
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
          uid: player.uid
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