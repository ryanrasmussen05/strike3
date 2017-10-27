import { Component } from '@angular/core';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import * as firebase from 'firebase';

enum LoginState { Login, Create, ResetPassword, ResetComplete }
enum ErrorType { Create, Reset }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;
  passwordConfirm: string;

  LoginState = LoginState;
  ErrorType = ErrorType;

  state: LoginState;
  error: string;
  errorType: ErrorType;
  loading: boolean = false;

  constructor(public userModel: UserModel, public userService: UserService) {
    this.state = LoginState.Login;
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
    this._clearErrors();

    this.userService.signIn(this.email, this.password).then(() => {
      this.loading = true;
    }).catch((error: firebase.auth.Error) => {
      this.error = this._getErrorText(error.code);
    });
  }

  createAccount() {
    this._clearErrors();

    this.userService.createUser(this.email, this.password).then(() => {
      this.loading = true;
    }).catch((error: firebase.auth.Error) => {
      this.error = this._getErrorText(error.code);
    });
  }

  resetPassword() {
    this._clearErrors();

    this.userService.resetPassword(this.email).then(() => {
      this.state = LoginState.ResetComplete;
      this.loading = true;
    }).catch((error: firebase.auth.Error) => {
      this.error = this._getErrorText(error.code);
    });
  }

  private _clearForm() {
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
