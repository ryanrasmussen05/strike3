import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Game, GamePick, GamePlayer } from './game';
import { PlayerModel } from '../player/player.model';
import { PickModel } from '../pick/pick.model';
import { UserModel } from '../user/user.model';
import { Pick } from '../pick/pick';

@Injectable()
export class GameModel {
  game$: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);

  constructor(public playerModel: PlayerModel, public pickModel: PickModel, public userModel: UserModel) {
    playerModel.allPlayers$.subscribe(() => { this._buildGameModel(); });
    pickModel.allPicks$.subscribe(() => { this._buildGameModel(); });
  }

  private _buildGameModel() {
    console.log('build game model');

    const currentUser = this.userModel.currentUser$.getValue();
    const allPlayers = this.playerModel.allPlayers$.getValue();

    const game: Game = { players: [] };

    if (allPlayers) {
      for (const player of allPlayers) {
        const gamePicks: GamePick[] = [];
        const picks = this._getPicksForPlayer(player.userId);

        for (const pick of picks) {
          const canEdit = currentUser && currentUser.uid === player.userId; //TODO check current week

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

        const gamePlayer: GamePlayer = {
          name: player.name,
          picks: gamePicks
        };

        game.players.push(gamePlayer);
      }
    }

    this.game$.next(game);
  }

  private _getPicksForPlayer(userId: string): Pick[] {
    const allPicks = this.pickModel.allPicks$.getValue();

    if (allPicks) {
      return allPicks.filter((currentPick) => {
        return currentPick.userId === userId;
      });
    } else {
      return [];
    }
  }
}
