import { AppState } from './index';
import { EmailAction, EmailActionTypes } from '../actions/email.actions';

export interface EmailState {
    sending: boolean;
    error: any;
}

const initialState: EmailState = {
    sending: false,
    error: null
};

export function reducer(state: EmailState = initialState, action: EmailAction): EmailState {
    switch (action.type) {
        case EmailActionTypes.SendEmail:
            return {
                sending: true,
                error: null
            };
        case EmailActionTypes.SendEmailSuccess:
            return {
                sending: false,
                error: null
            };
        case EmailActionTypes.SendEmailFailure:
            return {
                sending: false,
                error: action.payload
            };
        default:
            return state;
    }
}

export const EmailStateSelector = (state: AppState): EmailState => {
    return state.emailState;
};
