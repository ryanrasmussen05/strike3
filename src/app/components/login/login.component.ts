import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../reducers';
import { UserState, UserStateSelector } from '../../reducers/user.reducer';
import { CreateUser, ResetPassword, SignInUser, UserError } from '../../actions/user.actions';
import { BsModalRef } from 'ngx-bootstrap';

enum LoginState { Login, Create, ResetPassword, ResetComplete }

enum ErrorType { Create, Reset }

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;

    LoginState = LoginState;
    ErrorType = ErrorType;

    state: LoginState;
    error: string;
    errorType: ErrorType;
    loading: boolean = false;

    userStateSubscription: Subscription;

    constructor(private zone: NgZone, private store: Store<AppState>, private modalRef: BsModalRef) {
        this.state = LoginState.Login;
    }

    ngOnInit() {
        this.userStateSubscription = this.store.pipe(select(UserStateSelector)).subscribe((userState: UserState) => {
            this.loading = userState.loading;

            if (userState.error) {
                console.error(userState.error);
                this.error = this._getErrorText(userState.error.code);
            } else {
                this.error = null;
                this.errorType = null;
            }

            if (userState.loggedIn && !userState.loading) {
                this.closeModal();
            }

            if (userState.passwordResetComplete) {
                this.state = LoginState.ResetComplete;
            }
        });
    }

    ngOnDestroy() {
        this.userStateSubscription.unsubscribe();
        this.store.dispatch(new UserError(null));
    }

    closeModal() {
        this.modalRef.hide();
    }

    toggleCreateAccount() {
        this._clearForm();
        this.state = LoginState.Create;
    }

    toggleResetPassword() {
        this.store.dispatch(new UserError(null));
        this.state = LoginState.ResetPassword;
    }

    signIn() {
        this.store.dispatch(new SignInUser({username: this.email, password: this.password}));
    }

    createAccount() {
        const displayName = this.firstName + ' ' + this.lastName;
        this.store.dispatch(new CreateUser({email: this.email, displayName: displayName, password: this.password}));
    }

    resetPassword() {
        this.store.dispatch(new ResetPassword(this.email));
    }

    private _clearForm() {
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.password = null;
        this.passwordConfirm = null;
        this.store.dispatch(new UserError(null));
    }

    private _getErrorText(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid Email Address';

            case 'auth/user-disabled':
                return 'User Account Disabled';

            case 'auth/user-not-found':
                this.errorType = ErrorType.Create;
                return 'Account Not Found';

            case 'auth/wrong-password':
                this.errorType = ErrorType.Reset;
                return 'Incorrect Password';

            case 'auth/email-already-in-use':
                this.errorType = ErrorType.Reset;
                return 'Email Already Registered';

            case 'auth/weak-password':
                return 'Password must be at least 6 characters';

            default:
                return 'Error Occurred';
        }
    }
}
