import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Strike3Game } from './strike3.game';
import { ViewModelUtil } from './view.model.util';
import { GameDataModel } from '../gameData/game.data.model';
import { UserModel } from '../user/user.model';

@Injectable()
export class AdminViewModel {
    strike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);

    constructor(public viewModelUtil: ViewModelUtil, public gameDataModel: GameDataModel, public userModel: UserModel) {
        gameDataModel.gameData$.subscribe(() => {
            this._buildGameModel();
        });
        userModel.currentUser$.subscribe(() => {
            this._buildGameModel();
        });
    }

    private _buildGameModel() {
        console.log('build admin view model');

        const strike3Game = this.viewModelUtil.buildViewModel(true);

        this.strike3Game$.next(strike3Game);
    }
}
