import { Component, NgZone, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import * as firebase from 'firebase';

enum LoginState { Login, Create, ResetPassword, ResetComplete }
enum ErrorType { Create, Reset }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
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

  constructor(public userService: UserService, public zone: NgZone) {
    this.state = LoginState.Login;
  }

  ngOnInit() {
    $('#loginModal').on('closed.zf.reveal', () => {
      this.zone.run(() => {
        this.state = LoginState.Login;
        this._clearForm();
      });
    });
  }

  toggleCreateAccount() {
    this._clearForm();
    this.state = LoginState.Create;
  }

  toggleResetPassword() {
    this._clearErrors();
    this.state = LoginState.ResetPassword;
  }

  signIn() {
    this.loading = true;
    this._clearErrors();

    this.userService.signIn(this.email, this.password).then(() => {
      this.loading = false;
      this._closeModal();
    }).catch((error: firebase.auth.Error) => {
      this.loading = false;
      this.error = this._getErrorText(error.code);
    });
  }

  createAccount() {
    this.loading = true;
    this._clearErrors();

    const displayName = this.firstName + ' ' + this.lastName;

    this.userService.createUser(this.email, displayName, this.password).then(() => {
        this.loading = false;
        this._closeModal();
    }).catch((error: firebase.auth.Error) => {
      console.error(error);
      this.loading = false;
      this.error = this._getErrorText(error.code);
    });
  }

  resetPassword() {
    this.loading = true;
    this._clearErrors();

    this.userService.resetPassword(this.email).then(() => {
      this.loading = false;
      this.state = LoginState.ResetComplete;
    }).catch((error: firebase.auth.Error) => {
      this.loading = false;
      this.error = this._getErrorText(error.code);
    });
  }

  private _closeModal() {
    $('#loginModal').foundation('close');
  }

  private _clearForm() {
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.password = null;
    this.passwordConfirm = null;
    this._clearErrors();
  }

  private _clearErrors() {
    this.error = null;
    this.errorType = null;
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
