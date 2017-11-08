import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Game, GamePick, GamePlayer } from './game';
import { PickModel } from '../pick/pick.model';
import { UserModel } from '../user/user.model';
import { Pick } from '../pick/pick';
import { GameDataModel } from '../gameData/game.data.model';
import { Player } from '../gameData/player';

@Injectable()
export class GameModel {
  game$: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);

  constructor(public gameDataModel: GameDataModel, public pickModel: PickModel, public userModel: UserModel) {
    gameDataModel.allPlayers$.subscribe(() => { this._buildGameModel(); });
    gameDataModel.week$.subscribe(() => { this._buildGameModel(); });
    pickModel.allPicks$.subscribe(() => { this._buildGameModel(); });
  }

  private _buildGameModel() {
    console.log('build game model');

    const allPlayers = this.gameDataModel.allPlayers$.getValue();

    const game: Game = { players: [] };

    if (allPlayers) {
      for (const player of allPlayers) {

        const gamePlayer: GamePlayer = {
          name: player.name,
          picks: this._getGamePicksForPlayer(player)
        };

        game.players.push(gamePlayer);
      }
    }

    this._sortPlayers(game.players);

    this.game$.next(game);
  }

  private _getGamePicksForPlayer(player: Player): GamePick[] {
    const currentUser = this.userModel.currentUser$.getValue();

    const gamePicks: GamePick[] = [];
    const picks = this._getPicksForPlayer(player);

    for (const pick of picks) {
      const canEdit = currentUser && currentUser.uid === player.uid; //TODO check current week

      const gamePick: GamePick = {
        week: pick.week,
        team: pick.team,
        canEdit: canEdit
      };

      if (pick.win !== undefined && pick.win !== null) {
        gamePick.win = pick.win;
      }

      gamePicks.push(gamePick);
    }

    return gamePicks;
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
  private _sortPlayers(gamePlayers: GamePlayer[]) {
    gamePlayers.sort((a, b): number => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
}
