import { AppState } from './index';
import { createSelector } from '@ngrx/store';
import { LoadingAction, LoadingActionTypes } from '../actions/loading.actions';

export interface LoadingState {
    loading: boolean;
}

const initialState: LoadingState = {
    loading: false
};

export function reducer(state: LoadingState = initialState, action: LoadingAction): LoadingState {
    switch (action.type) {
        case LoadingActionTypes.LoadingBegin:
            return {
                loading: true
            };
        case LoadingActionTypes.LoadingEnd:
            return {
                loading: false
            };
        default:
            return state;
    }
}

export const LoadingStateSelector = (state: AppState): LoadingState => {
    return state.loadingState;
};

export const LoadingSelector = createSelector(
    LoadingStateSelector,
    (state: LoadingState) => state.loading
);
