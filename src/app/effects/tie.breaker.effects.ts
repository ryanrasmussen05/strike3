import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import { GetGameDataSuccess } from '../actions/game.data.actions';
import { GameDataService } from '../services/game.data.service';
import { ConvertServiceGameData } from '../util/game.data.util';
import { GameData } from '../models/game.data';
import {
    CreateTieBreaker,
    CreateTieBreakerFailure,
    CreateTieBreakerSuccess,
    DeleteTieBreaker, DeleteTieBreakerFailure, DeleteTieBreakerSuccess,
    TieBreakerActionTypes
} from '../actions/tie.breaker.actions';

@Injectable()
export class TieBreakerEffects {

    constructor(private actions$: Actions, private gameDataService: GameDataService) {
    }

    @Effect()
    submitTieBreaker$: Observable<Action> =
        this.actions$.pipe(
            ofType(TieBreakerActionTypes.CreateTieBreaker),
            switchMap((action: CreateTieBreaker) => {
                return this.gameDataService.submitTieBreaker(action.payload);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((updatedGameData: GameData) => {
                return [
                    new GetGameDataSuccess(ConvertServiceGameData(updatedGameData)),
                    new CreateTieBreakerSuccess()
                ];
            }),
            catchError((error: any) => {
                return of(new CreateTieBreakerFailure(error));
            })
        );

    @Effect()
    deleteTieBreaker$: Observable<Action> =
        this.actions$.pipe(
            ofType(TieBreakerActionTypes.DeleteTieBreaker),
            switchMap((action: DeleteTieBreaker) => {
                return this.gameDataService.deleteTieBreaker(action.payload);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((updatedGameData: GameData) => {
                return [
                    new GetGameDataSuccess(ConvertServiceGameData(updatedGameData)),
                    new DeleteTieBreakerSuccess()
                ];
            }),
            catchError((error: any) => {
                return of(new DeleteTieBreakerFailure(error));
            })
        );
}
