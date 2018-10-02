import { Action } from '@ngrx/store';
import * as firebase from 'firebase/app';
import { GameData } from '../models/game.data';
import { User } from '../models/user';

export enum UserActionTypes {
    CreateUser = '[User] Create',
    UserCreated = '[User] Created',
    SetUser = '[User] Set',
    SignOutUser = '[User] Sign Out',
    SignInUser = '[User] Sign In',
    UserError = '[User] Error',
    ResetPassword = '[User] Reset Password',
    ResetPasswordComplete = '[User] Reset Password Complete',
    UpdateProfile = '[User] Update Profile',
    UpdateProfileComplete = '[User] Update Profile Complete',
    UpdateProfileReset = '[User] Update Profile Reset'
}

export class CreateUser implements Action {
    readonly type = UserActionTypes.CreateUser;

    constructor(public payload: {email: string, displayName: string, password: string}) {}
}

export class UserCreated implements Action {
    readonly type = UserActionTypes.UserCreated;

    constructor(public payload: GameData) {}
}

export class SetUser implements Action {
    readonly type = UserActionTypes.SetUser;

    constructor(public payload: User) {}
}

export class SignOutUser implements Action {
    readonly type = UserActionTypes.SignOutUser;
}

export class SignInUser implements Action {
    readonly type = UserActionTypes.SignInUser;

    constructor(public payload: {username: string, password: string}) {}
}

export class UserError implements Action {
    readonly type = UserActionTypes.UserError;

    constructor(public payload: firebase.auth.Error) {}
}

export class ResetPassword implements Action {
    readonly type = UserActionTypes.ResetPassword;

    constructor(public payload: string) {}
}

export class ResetPasswordComplete implements Action {
    readonly type = UserActionTypes.ResetPasswordComplete;
}

export class UpdateProfile implements Action {
    readonly type = UserActionTypes.UpdateProfile;

    constructor(public payload: User) {}
}

export class UpdateProfileComplete implements Action {
    readonly type = UserActionTypes.UpdateProfileComplete;

    constructor(public payload: GameData) {}
}

export class UpdateProfileReset implements Action {
    readonly type = UserActionTypes.UpdateProfileReset;
}

export type UserAction =
    CreateUser |
    UserCreated |
    SetUser |
    SignOutUser |
    SignInUser |
    ResetPassword |
    ResetPasswordComplete |
    UserError |
    UpdateProfile |
    UpdateProfileComplete |
    UpdateProfileReset;
