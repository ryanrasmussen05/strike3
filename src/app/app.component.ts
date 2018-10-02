import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppState } from './reducers';
import { Store } from '@ngrx/store';
import { SetUser } from './actions/user.actions';
import * as firebase from 'firebase';
import { User } from './models/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {
        this.afAuth.auth.onAuthStateChanged(
            (user: firebase.User) => {
                this.setUser(user);
            }
        );
    }

    private setUser(firebaseUser: firebase.User) {
        let user: User = null;

        if (firebaseUser) {
            user = {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                uid: firebaseUser.uid
            };
        }

        this.store.dispatch(new SetUser(user));
    }
}
