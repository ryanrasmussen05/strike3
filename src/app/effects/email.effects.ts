import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import { EmailService } from '../services/email.service';
import { EmailActionTypes, SendEmail, SendEmailFailure, SendEmailSuccess } from '../actions/email.actions';
import { LoadingBegin, LoadingEnd } from '../actions/loading.actions';

@Injectable()
export class EmailEffects {

    constructor(private actions$: Actions, private emailService: EmailService) {
    }

    @Effect()
    sendEmail$: Observable<Action> =
        this.actions$.pipe(
            ofType(EmailActionTypes.SendEmail),
            switchMap((action: SendEmail) => {
                return this.emailService.sendEmail(action.payload);
            }),
            switchMap((result: any) => {
                console.log(result);
                return of(new SendEmailSuccess());
            }),
            catchError((error: any) => {
                return of(new SendEmailFailure(error));
            })
        );

    @Effect()
    sendEmailBegin$: Observable<Action> =
        this.actions$.pipe(
            ofType(EmailActionTypes.SendEmail),
            switchMap(() => {
                return of(new LoadingBegin());
            })
        );

    @Effect()
    sendEmailEnd$: Observable<Action> =
        this.actions$.pipe(
            ofType(EmailActionTypes.SendEmailSuccess, EmailActionTypes.SendEmailFailure),
            switchMap(() => {
                return of(new LoadingEnd());
            })
        );

}
