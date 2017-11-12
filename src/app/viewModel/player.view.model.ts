import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PickModel } from '../pick/pick.model';
import { GameDataModel } from '../gameData/game.data.model';
import { Strike3Game } from './strike3.game';
import { ViewModelUtil } from './view.model.util';

@Injectable()
export class PlayerViewModel {
  strike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);

  constructor(public gameDataModel: GameDataModel, public pickModel: PickModel, public viewModelUtil: ViewModelUtil) {
    gameDataModel.allPlayers$.subscribe(() => { this._buildGameModel(); });
    gameDataModel.week$.subscribe(() => { this._buildGameModel(); });
    pickModel.allPicks$.subscribe(() => { this._buildGameModel(); });
  }

  private _buildGameModel() {
    console.log('build player view model');

    const strike3Game = this.viewModelUtil.buildViewModel(false);

    this.strike3Game$.next(strike3Game);
  }

}
