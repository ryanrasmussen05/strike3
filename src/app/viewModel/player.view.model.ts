import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameDataModel } from '../gameData/game.data.model';
import { Strike3Game } from './strike3.game';
import { ViewModelUtil } from './view.model.util';
import { UserModel } from '../user/user.model';

@Injectable()
export class PlayerViewModel {
    strike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);

    constructor(public gameDataModel: GameDataModel, public viewModelUtil: ViewModelUtil, public userModel: UserModel) {
        gameDataModel.gameData$.subscribe(() => {
            this._buildGameModel();
        });
        userModel.currentUser$.subscribe(() => {
            this._buildGameModel();
        });
    }

    private _buildGameModel() {
        console.log('build player view model');

        const strike3Game = this.viewModelUtil.buildViewModel(false);

        this.strike3Game$.next(strike3Game);
    }

}
