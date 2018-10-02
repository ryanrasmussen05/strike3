import { Action } from '@ngrx/store';
import { TieBreaker } from '../models/tie.breaker';

export enum TieBreakerActionTypes {
    CreateTieBreaker = '[Tie Breaker] Create',
    CreateTieBreakerSuccess = '[Tie Breaker] Create Success',
    CreateTieBreakerFailure = '[Tie Breaker] Create Failure',
    DeleteTieBreaker = '[Tie Breaker] Delete',
    DeleteTieBreakerSuccess = '[Tie Breaker] Delete Success',
    DeleteTieBreakerFailure = '[Tie Breaker] Delete Failure',
    ResetTieBreaker = '[Tie Breaker] Reset'
}

export class CreateTieBreaker implements Action {
    readonly type = TieBreakerActionTypes.CreateTieBreaker;

    constructor(public payload: TieBreaker) {}
}

export class CreateTieBreakerSuccess implements Action {
    readonly type = TieBreakerActionTypes.CreateTieBreakerSuccess;
}

export class CreateTieBreakerFailure implements Action {
    readonly type = TieBreakerActionTypes.CreateTieBreakerFailure;

    constructor(public payload: string) {}
}

export class DeleteTieBreaker implements Action {
    readonly type = TieBreakerActionTypes.DeleteTieBreaker;

    constructor(public payload: TieBreaker) {}
}

export class DeleteTieBreakerSuccess implements Action {
    readonly type = TieBreakerActionTypes.DeleteTieBreakerSuccess;
}

export class DeleteTieBreakerFailure implements Action {
    readonly type = TieBreakerActionTypes.DeleteTieBreakerFailure;

    constructor(public payload: string) {}
}

export class ResetTieBreaker implements Action {
    readonly type = TieBreakerActionTypes.ResetTieBreaker;
}

export type TieBreakerAction =
    CreateTieBreaker |
    CreateTieBreakerSuccess |
    CreateTieBreakerFailure |
    DeleteTieBreaker |
    DeleteTieBreakerSuccess |
    DeleteTieBreakerFailure |
    ResetTieBreaker;
