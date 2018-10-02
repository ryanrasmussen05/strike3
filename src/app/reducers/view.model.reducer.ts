import { createSelector } from '@ngrx/store';
import { GameDataSelector } from './game.data.reducer';
import { UserSelector } from './user.reducer';
import { GameData } from '../models/game.data';
import { BuildViewModel } from '../util/view.model.util';
import { User } from '../models/user';

export const PlayerViewModelSelector = createSelector(
    GameDataSelector,
    UserSelector,
    (gameData: GameData, user: User) => {
        return BuildViewModel(false, gameData, user);
    }
);

export const AdminViewModelSelector = createSelector(
    GameDataSelector,
    UserSelector,
    (gameData: GameData, user: User) => {
        return BuildViewModel(true, gameData, user);
    }
);
