import { AppState } from './index';
import { PickAction, PickActionTypes } from '../actions/pick.actions';

export interface PickState {
    submitting: boolean;
    pickSubmitted: boolean;
    error: string;
}

const initialState: PickState = {
    submitting: false,
    pickSubmitted: false,
    error: null
};

export function reducer(state: PickState = initialState, action: PickAction): PickState {
    switch (action.type) {
        case PickActionTypes.SubmitPick:
            return {
                submitting: true,
                pickSubmitted: false,
                error: null
            };
        case PickActionTypes.SubmitPickSuccess:
            return {
                submitting: false,
                pickSubmitted: true,
                error: null
            };
        case PickActionTypes.SubmitPickFailure:
            return {
                submitting: false,
                pickSubmitted: false,
                error: action.payload
            };
        case PickActionTypes.PickReset:
            return initialState;
        default:
            return state;
    }
}

export const PickStateSelector = (state: AppState): PickState => {
    return state.pickState;
};
