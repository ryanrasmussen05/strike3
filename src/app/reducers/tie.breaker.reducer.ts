import { AppState } from './index';
import { TieBreakerAction, TieBreakerActionTypes } from '../actions/tie.breaker.actions';

export interface TieBreakerState {
    submitting: boolean;
    submitted: boolean;
    error: string;
}

const initialState: TieBreakerState = {
    submitting: false,
    submitted: false,
    error: null
};

export function reducer(state: TieBreakerState = initialState, action: TieBreakerAction): TieBreakerState {
    switch (action.type) {
        case TieBreakerActionTypes.CreateTieBreaker:
            return {
                submitting: true,
                submitted: false,
                error: null
            };
        case TieBreakerActionTypes.CreateTieBreakerSuccess:
            return {
                submitting: false,
                submitted: true,
                error: null
            };
        case TieBreakerActionTypes.CreateTieBreakerFailure:
            return {
                submitting: false,
                submitted: false,
                error: action.payload
            };
        case TieBreakerActionTypes.DeleteTieBreaker:
            return {
                submitting: true,
                submitted: false,
                error: null
            };
        case TieBreakerActionTypes.DeleteTieBreakerSuccess:
            return initialState;
        case TieBreakerActionTypes.DeleteTieBreakerFailure:
            return {
                submitting: false,
                submitted: false,
                error: action.payload
            };
        case TieBreakerActionTypes.ResetTieBreaker:
            return initialState;
        default:
            return state;
    }
}

export const TieBreakerStateSelector = (state: AppState): TieBreakerState => {
    return state.tieBreakerState;
};
