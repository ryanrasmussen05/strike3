import { Action } from '@ngrx/store';
import { Email } from '../models/email';

export enum EmailActionTypes {
    SendEmail = '[Email] Send',
    SendEmailSuccess = '[Email] Send Success',
    SendEmailFailure = '[Email] Send Failure'
}

export class SendEmail implements Action {
    readonly type = EmailActionTypes.SendEmail;

    constructor(public payload: Email) {}
}

export class SendEmailSuccess implements Action {
    readonly type = EmailActionTypes.SendEmailSuccess;
}

export class SendEmailFailure implements Action {
    readonly type = EmailActionTypes.SendEmailFailure;

    constructor(public payload: any) {}
}

export type EmailAction =
    SendEmail |
    SendEmailSuccess |
    SendEmailFailure;
