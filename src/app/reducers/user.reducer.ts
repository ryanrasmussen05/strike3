import { AppState } from './index';
import { UserAction, UserActionTypes } from '../actions/user.actions';
import { createSelector } from '@ngrx/store';
import * as firebase from 'firebase/app';
import { User } from '../models/user';

export interface UserState {
    loggedIn: boolean;
    user: User;
    loading: boolean;
    passwordResetComplete: boolean;
    profileUpdateComplete: boolean;
    error: firebase.auth.Error;
}

const initialState: UserState = {
    loggedIn: false,
    user: null,
    loading: false,
    passwordResetComplete: false,
    profileUpdateComplete: false,
    error: null
};

export function reducer(state: UserState = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionTypes.CreateUser:
            return {
                loggedIn: false,
                user: null,
                loading: true,
                passwordResetComplete: false,
                profileUpdateComplete: false,
                error: null
            };
        case UserActionTypes.UserCreated:
            return {
                ...state,
                loading: false
            };
        case UserActionTypes.SetUser:
            return {
                loggedIn: !!action.payload,
                user: action.payload,
                loading: false,
                passwordResetComplete: false,
                profileUpdateComplete: false,
                error: null
            };
        case UserActionTypes.SignOutUser:
            return {
                loggedIn: false,
                user: null,
                loading: false,
                passwordResetComplete: false,
                profileUpdateComplete: false,
                error: null
            };
        case UserActionTypes.SignInUser:
            return {
                loggedIn: false,
                user: null,
                loading: true,
                passwordResetComplete: false,
                profileUpdateComplete: false,
                error: null
            };
        case UserActionTypes.ResetPassword:
            return {
                ...state,
                loading: true,
                passwordResetComplete: false,
                error: null
            };
        case UserActionTypes.ResetPasswordComplete:
            return {
                ...state,
                loading: false,
                passwordResetComplete: true,
                error: null
            };
        case UserActionTypes.UpdateProfile:
            return {
                ...state,
                loading: true,
                profileUpdateComplete: false,
                error: null
            };
        case UserActionTypes.UpdateProfileComplete:
            return {
                ...state,
                loading: false,
                profileUpdateComplete: true,
                error: null
            };
        case UserActionTypes.UpdateProfileReset:
            return {
                ...state,
                profileUpdateComplete: false
            };
        case UserActionTypes.UserError:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}

export const UserStateSelector = (state: AppState): UserState => {
    return state.userState;
};

export const UserSelector = createSelector(
    UserStateSelector,
    (userState: UserState) => userState.user
);
