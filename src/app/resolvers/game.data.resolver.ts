import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable, of } from 'rxjs';
import { GetGameData } from '../actions/game.data.actions';
import { GameDataState, GameDataStateSelector } from '../reducers/game.data.reducer';
import { filter, switchMap, take } from 'rxjs/operators';
import { LoadingBegin, LoadingEnd } from '../actions/loading.actions';


@Injectable()
export class GameDataResolver implements Resolve<boolean> {

    constructor(private store: Store<AppState>) {
    }

    resolve(): Observable<boolean> {
        this.store.dispatch(new LoadingBegin());
        this.store.dispatch(new GetGameData());

        return this.waitForGameDataToLoad().pipe(
            switchMap(() => {
                this.store.dispatch(new LoadingEnd());
                return of(true);
            })
        );
    }

    private waitForGameDataToLoad(): Observable<GameDataState> {
        return this.store.pipe(
            select(GameDataStateSelector),
            filter(gameDataState => !!gameDataState.gameData && !gameDataState.loading),
            take(1)
        );
    }
}
