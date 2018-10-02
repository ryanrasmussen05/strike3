import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, catchError } from 'rxjs/operators';
import { CreateUser, ResetPassword, ResetPasswordComplete, SetUser, SignInUser, UserAction, UserActionTypes, UserCreated, UserError, UpdateProfile, UpdateProfileComplete } from '../actions/user.actions';
import { NavigateTo, NavigationActionTypes } from '../actions/navigation.actions';
import * as firebase from 'firebase/app';
import { GameDataActionTypes, GetGameDataSuccess } from '../actions/game.data.actions';
import { GameDataService } from '../services/game.data.service';
import { ConvertServiceGameData } from '../util/game.data.util';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {

    constructor(private actions$: Actions, private userService: UserService, private gameDataService: GameDataService) {
    }

    @Effect()
    signIn$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.SignInUser),
            switchMap((action: SignInUser) => {
                return this.userService.signIn(action.payload.username, action.payload.password).then((cred: firebase.auth.UserCredential) => {
                    return new SetUser({ name: cred.user.displayName, email: cred.user.email, uid: cred.user.uid });
                }).catch((error: firebase.auth.Error) => {
                    return new UserError(error);
                });
            })
        );

    @Effect()
    createUser$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.CreateUser),
            switchMap((action: CreateUser) => {
                return from(this.userService.createUser(action.payload.email, action.payload.displayName, action.payload.password));
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return of(new UserCreated(ConvertServiceGameData(serviceGameData)));
            })
        );

    @Effect()
    userCreated$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.UserCreated),
            switchMap((action: UserCreated) => {
                return of(new GetGameDataSuccess(action.payload));
            })
        );

    @Effect()
    signOut$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.SignOutUser),
            switchMap(() => {
                return this.userService.signOut().then(() => {
                    return new NavigateTo('player');
                });
            })
        );

    @Effect()
    resetPassword$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.ResetPassword),
            switchMap((action: ResetPassword) => {
                return this.userService.resetPassword(action.payload).then(() => {
                    return new ResetPasswordComplete();
                });
            })
        );

    @Effect()
    updateProfile$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.UpdateProfile),
            switchMap((action: UpdateProfile) => {
                return this.userService.updateUsername(action.payload.name).pipe(switchMap(() => of(action)));
            }),
            switchMap((action: UpdateProfile) => {
                return this.gameDataService.changePlayerName(action.payload, action.payload.name);
            }),
            switchMap(() => {
                return this.gameDataService.getGameData();
            }),
            switchMap((serviceGameData: any) => {
                return of(new UpdateProfileComplete(ConvertServiceGameData(serviceGameData)));
            }),
            catchError((error: any) => {
                return of(new UserError(error));
            })
        );

    @Effect()
    updateProfileComplete$: Observable<Action> =
        this.actions$.pipe(
            ofType(UserActionTypes.UpdateProfileComplete),
            switchMap((action: UpdateProfileComplete) => {
                return of(new GetGameDataSuccess(action.payload));
            })
        );
}
