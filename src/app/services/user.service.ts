import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GameDataService } from './game.data.service';
import { switchMap, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { SetUser } from '../actions/user.actions';

@Injectable()
export class UserService {

    constructor(private gameDataService: GameDataService, private afAuth: AngularFireAuth, private store: Store<AppState>) {
    }

    signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    signOut(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    createUser(email: string, displayName: string, password: string): Promise<void> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((credential: firebase.auth.UserCredential) => {
            return this.setUsername(credential.user, displayName).then(() => {
                return this.addPlayerForUser(credential.user);
            });
        });
    }

    resetPassword(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    setUsername(user: firebase.User, name: string): Promise<void> {
        return user.updateProfile({displayName: name, photoURL: null}).then(() => {
            this.store.dispatch(new SetUser({email: user.email, uid: user.uid, name: name}));
        });
    }

    updateUsername(name: string): Observable<void> {
        return this.afAuth.user.pipe(
            take(1),
            switchMap((user: firebase.User) => {
                return from(this.setUsername(user, name));
            })
        );
    }

    addPlayerForUser(user: firebase.User): Promise<void> {
        return this.gameDataService.addPlayerForUser({name: user.displayName, email: user.email, uid: user.uid});
    }
}
