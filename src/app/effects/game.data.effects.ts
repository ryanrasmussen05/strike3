import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import {
    GameDataActionTypes,
    GetGameDataFailure,
    GetGameDataSuccess, GetScheduleFailure, GetScheduleSuccess, PostSchedule, PostScheduleFailure, PostScheduleSuccess,
    UpdateResults,
    UpdateResultsSuccess, UpdateWeek, UpdateWeekFailure, UpdateWeekSuccess
} from '../actions/game.data.actions';
import { GameDataService } from '../services/game.data.service';
import { ConvertServiceGameData, GetDaysToUpdateScores, GetOpenPicks } from '../util/game.data.util';
import { LoadingBegin, LoadingEnd } from '../actions/loading.actions';
import { GameData } from '../models/game.data';
import { NFLService } from '../services/nfl.service';
import { MergeScoreboards } from '../util/nfl.util';
import * as clone from 'clone';
import { NFLSchedule } from '../models/nfl.schedule';

@Injectable()
export class GameDataEffects {

    constructor(private actions$: Actions, private gameDataService: GameDataService, private nflService: NFLService) {
    }

    @Effect()
    getGameData$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.GetGameData),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return of(new GetGameDataSuccess(ConvertServiceGameData(serviceGameData)));
            }),
            catchError((error: any) => {
                return of(new GetGameDataFailure(error));
            })
        );

    @Effect()
    setWeek$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.UpdateWeek),
            switchMap((action: UpdateWeek) => {
                return this.gameDataService.setWeek(action.payload);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return of(new UpdateWeekSuccess(ConvertServiceGameData(serviceGameData)));
            }),
            catchError((error: any) => {
                return of(new UpdateWeekFailure(error));
            })
        );

    @Effect()
    getSchedule$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.GetSchedule),
            switchMap(() => {
                return this.nflService.getNflSchedule();
            }),
            switchMap((nflSchedule: NFLSchedule) => {
                return of(new GetScheduleSuccess(nflSchedule));
            }),
            catchError((error: any) => {
                return of(new GetScheduleFailure(error));
            })
        );

    @Effect()
    postSchedule$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.PostSchedule),
            switchMap((action: PostSchedule) => {
                return this.gameDataService.setSchedule(action.payload);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return [
                    new GetGameDataSuccess(ConvertServiceGameData(serviceGameData)),
                    new PostScheduleSuccess()
                ];
            }),
            catchError((error: any) => {
                return of(new PostScheduleFailure(error));
            })
        );

    @Effect()
    updateResultsBegin$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.UpdateResults),
            switchMap(() => {
                return of(new LoadingBegin());
            })
        );

    @Effect()
    updateResultsComplete$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.UpdateResultsSuccess, GameDataActionTypes.UpdateResultsFailure),
            switchMap(() => {
                return of(new LoadingEnd());
            })
        );

    @Effect()
    updateResults$: Observable<Action> =
        this.actions$.pipe(
            ofType(GameDataActionTypes.UpdateResults),
            switchMap((action: UpdateResults) => {
                return this.updateResults(action.payload);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return of(new UpdateResultsSuccess(ConvertServiceGameData(serviceGameData)));
            }),
        );

    updateResults(gameData: GameData): Promise<any> {
        const openPicks = GetOpenPicks(gameData);
        const daysToUpdate = GetDaysToUpdateScores(gameData, openPicks);
        const updatePromises = [];

        daysToUpdate.forEach((dayToUpdate) => {
            updatePromises.push(this.nflService.getScoreboardForDate(dayToUpdate));
        });

        return Promise.all(updatePromises).then((values) => {
            const scoreboard = MergeScoreboards(values);
            const pickUpdatePromises = [];

            openPicks.forEach((openPickTuple) => {
                const pick = clone(openPickTuple[0]);
                const uid = openPickTuple[1];

                if (scoreboard.get(pick.week) && scoreboard.get(pick.week).get(pick.team)) {
                    pick.status = scoreboard.get(pick.week).get(pick.team);
                    pickUpdatePromises.push(this.gameDataService.submitPick(pick, uid));
                }
            });

            return Promise.all(pickUpdatePromises);
        });
    }
}
