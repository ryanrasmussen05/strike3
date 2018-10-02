import { Action } from '@ngrx/store';
import { GameData } from '../models/game.data';
import { Week } from '../models/week';
import { NFLSchedule } from '../models/nfl.schedule';

export enum GameDataActionTypes {
    GetGameData = '[GameData] Get',
    GetGameDataSuccess = '[GameData] Get Success',
    GetGameDataFailure = '[GameData] Get Failure',
    UpdateResults = '[GameData] Update Results',
    UpdateResultsSuccess = '[GameData] Update Results Success',
    UpdateResultsFailure = '[GameData] Update Results Failure',
    UpdateWeek = '[GameData] Update Week',
    UpdateWeekSuccess = '[GameData] Update Week Success',
    UpdateWeekFailure = '[GameData] Update Week Failure',
    GetSchedule = '[GameData] Get Schedule',
    GetScheduleSuccess = '[GameData] Get Schedule Success',
    GetScheduleFailure = '[GameData] Get Schedule Failure',
    PostSchedule = '[GameData] Post Schedule',
    PostScheduleSuccess = '[GameData] Post Schedule Success',
    PostScheduleFailure = '[GameData] Post Schedule Failure'
}

export class GetGameData implements Action {
    readonly type = GameDataActionTypes.GetGameData;
}

export class GetGameDataSuccess implements Action {
    readonly type = GameDataActionTypes.GetGameDataSuccess;

    constructor(public payload: GameData) {}
}

export class GetGameDataFailure implements Action {
    readonly type = GameDataActionTypes.GetGameDataFailure;

    constructor(public payload: string) {}
}

export class UpdateResults implements Action {
    readonly type = GameDataActionTypes.UpdateResults;

    constructor(public payload: GameData) {}
}

export class UpdateResultsSuccess implements Action {
    readonly type = GameDataActionTypes.UpdateResultsSuccess;

    constructor(public payload: GameData) {}
}

export class UpdateResultsFailure implements Action {
    readonly type = GameDataActionTypes.UpdateResultsFailure;

    constructor(public payload: string) {}
}

export class UpdateWeek implements Action {
    readonly type = GameDataActionTypes.UpdateWeek;

    constructor(public payload: Week) {}
}

export class UpdateWeekSuccess implements Action {
    readonly type = GameDataActionTypes.UpdateWeekSuccess;

    constructor(public payload: GameData) {}
}

export class UpdateWeekFailure implements Action {
    readonly type = GameDataActionTypes.UpdateWeekFailure;

    constructor(public payload: string) {}
}

export class GetSchedule implements Action {
    readonly type = GameDataActionTypes.GetSchedule;
}

export class GetScheduleSuccess implements Action {
    readonly type = GameDataActionTypes.GetScheduleSuccess;

    constructor(public payload: NFLSchedule) {}
}

export class GetScheduleFailure implements Action {
    readonly type = GameDataActionTypes.GetScheduleFailure;

    constructor(public payload: any) {}
}

export class PostSchedule implements Action {
    readonly type = GameDataActionTypes.PostSchedule;

    constructor(public payload: NFLSchedule) {}
}

export class PostScheduleSuccess implements Action {
    readonly type = GameDataActionTypes.PostScheduleSuccess;
}

export class PostScheduleFailure implements Action {
    readonly type = GameDataActionTypes.PostScheduleFailure;

    constructor(public payload: any) {}
}

export type GameDataAction =
    GetGameData |
    GetGameDataSuccess |
    GetGameDataFailure |
    UpdateResults |
    UpdateResultsSuccess |
    UpdateResultsFailure |
    UpdateWeek |
    UpdateWeekSuccess |
    UpdateWeekFailure |
    GetSchedule |
    GetScheduleSuccess |
    GetScheduleFailure |
    PostSchedule |
    PostScheduleSuccess |
    PostScheduleFailure;
