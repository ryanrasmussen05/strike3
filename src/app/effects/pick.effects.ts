import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import { GetGameDataSuccess } from '../actions/game.data.actions';
import { GameDataService } from '../services/game.data.service';
import { AddOrUpdatePick, ReadyToMakeWeekPublic } from '../util/game.data.util';
import { PickActionTypes, SubmitPick, SubmitPickFailure, SubmitPickSuccess } from '../actions/pick.actions';
import { GameData } from '../models/game.data';
import { Week } from '../models/week';
import * as clone from 'clone';

@Injectable()
export class PickEffects {

    constructor(private actions$: Actions, private gameDataService: GameDataService) {
    }

    @Effect()
    submitPick$: Observable<Action> =
        this.actions$.pipe(
            ofType(PickActionTypes.SubmitPick),
            switchMap((action: SubmitPick) => {
                return from(this.gameDataService.submitPick(action.payload.pick, action.payload.uid)).pipe(
                    switchMap(() => of(action))
                );
            }),
            switchMap((action: SubmitPick) => {
                const clonedGameData: GameData = clone(action.payload.gameData);
                const updateGameData: GameData = AddOrUpdatePick(clonedGameData, action.payload.pick, action.payload.uid);
                const readyToMakeWeekPublic = ReadyToMakeWeekPublic(updateGameData);

                if (readyToMakeWeekPublic) {
                    const week: Week = updateGameData.week;
                    week.public = true;

                    return from(this.gameDataService.setWeek(week)).pipe(
                        switchMap(() => of(updateGameData))
                    );
                } else {
                    return of(updateGameData);
                }
            }),
            switchMap((updatedGameData: GameData) => {
                return [
                    new GetGameDataSuccess(updatedGameData),
                    new SubmitPickSuccess()
                ];
            }),
            catchError((error: any) => {
                return of(new SubmitPickFailure(error));
            })
        );
}
