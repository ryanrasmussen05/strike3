import { AppState } from './index';
import { Strike3Game, Strike3Pick } from '../models/strike3.game';
import { TieBreaker } from '../models/tie.breaker';
import { ContextAction, ContextActionTypes } from '../actions/context.actions';
import { createSelector } from '@ngrx/store';

export interface ContextState {
    contextStrike3Game: Strike3Game;
    contextTieBreaker: TieBreaker;
    contextStrike3Pick: Strike3Pick;
}

const initialState: ContextState = {
    contextStrike3Game: null,
    contextTieBreaker: null,
    contextStrike3Pick: null
};

export function reducer(state: ContextState = initialState, action: ContextAction): ContextState {
    switch (action.type) {
        case ContextActionTypes.SetContextStrike3Game:
            return {
                ...state,
                contextStrike3Game: action.payload
            };
        case ContextActionTypes.SetContextStrike3Pick:
            return {
                ...state,
                contextStrike3Pick: action.payload
            };
        case ContextActionTypes.SetContextTieBreaker:
            return {
                ...state,
                contextTieBreaker: action.payload
            };
        default:
            return state;
    }
}

export const ContextStateSelector = (state: AppState): ContextState => {
    return state.contextState;
};

export const ContextStrike3GameSelector = createSelector(
    ContextStateSelector,
    (state: ContextState) => state.contextStrike3Game
);

export const ContextStrike3PickSelector = createSelector(
    ContextStateSelector,
    (state: ContextState) => state.contextStrike3Pick
);

export const ContextTieBreakerSelector = createSelector(
    ContextStateSelector,
    (state: ContextState) => state.contextTieBreaker
);
