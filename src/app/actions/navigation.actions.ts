import { Action } from '@ngrx/store';

export enum NavigationActionTypes {
    Navigate = '[Navigate] Begin',
    NavigateEnd = '[Navigate] End'
}

export class NavigateTo implements Action {
    readonly type = NavigationActionTypes.Navigate;

    constructor(public payload: string) {}
}

export class NavigateEnd implements Action {
    readonly type = NavigationActionTypes.NavigateEnd;
}

export type NavigationAction =
    NavigateTo |
    NavigateEnd;
