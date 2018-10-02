import { Action } from '@ngrx/store';
import { Pick } from '../models/pick';
import { GameData } from '../models/game.data';

export enum PickActionTypes {
    SubmitPick = '[Pick] Submit',
    SubmitPickSuccess = '[Pick] Submit Success',
    SubmitPickFailure = '[Pick] Submit Failure',
    PickReset = '[Pick] Reset'
}

export class SubmitPick implements Action {
    readonly type = PickActionTypes.SubmitPick;

    constructor(public payload: {pick: Pick, uid: string, gameData: GameData}) {}
}

export class SubmitPickSuccess implements Action {
    readonly type = PickActionTypes.SubmitPickSuccess;
}

export class SubmitPickFailure implements Action {
    readonly type = PickActionTypes.SubmitPickFailure;

    constructor(public payload: string) {}
}

export class ResetPickState implements Action {
    readonly type = PickActionTypes.PickReset;
}

export type PickAction =
    SubmitPick |
    SubmitPickSuccess |
    SubmitPickFailure |
    ResetPickState;
