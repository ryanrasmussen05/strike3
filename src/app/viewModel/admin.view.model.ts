import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PickModel } from '../pick/pick.model';
import { Strike3Game } from './strike3.game';
import { ViewModelUtil } from './view.model.util';

@Injectable()
export class AdminViewModel {
  strike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);

  constructor(public pickModel: PickModel, public viewModelUtil: ViewModelUtil) {
    pickModel.allPicksAdmin$.subscribe(() => { this._buildGameModel(); });
  }

  private _buildGameModel() {
    console.log('build admin view model');

    const strike3Game = this.viewModelUtil.buildViewModel(true);

    this.strike3Game$.next(strike3Game);
  }
}
