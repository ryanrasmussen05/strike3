import { Action } from '@ngrx/store';
import { Strike3Game, Strike3Pick } from '../models/strike3.game';
import { TieBreaker } from '../models/tie.breaker';

export enum ContextActionTypes {
    SetContextStrike3Game = '[Context] Set Game',
    SetContextTieBreaker = '[Context] Set Tie Breaker',
    SetContextStrike3Pick = '[Context] Set Pick'
}

export class SetContextStrike3Game implements Action {
    readonly type = ContextActionTypes.SetContextStrike3Game;

    constructor(public payload: Strike3Game) {}
}

export class SetContextTieBreaker implements Action {
    readonly type = ContextActionTypes.SetContextTieBreaker;

    constructor(public payload: TieBreaker) {}
}

export class SetContextStrike3Pick implements Action {
    readonly type = ContextActionTypes.SetContextStrike3Pick;

    constructor(public payload: Strike3Pick) {}
}

export type ContextAction =
    SetContextStrike3Game |
    SetContextTieBreaker |
    SetContextStrike3Pick;
