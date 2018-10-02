import { Action } from '@ngrx/store';

export enum LoadingActionTypes {
    LoadingBegin = '[Loading] Begin',
    LoadingEnd = '[Loading] End'
}

export class LoadingBegin implements Action {
    readonly type = LoadingActionTypes.LoadingBegin;
}

export class LoadingEnd implements Action {
    readonly type = LoadingActionTypes.LoadingEnd;
}

export type LoadingAction =
    LoadingBegin |
    LoadingEnd;
