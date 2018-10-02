import { Injectable } from '@angular/core';
import { AngularFireFunctions } from 'angularfire2/functions';
import { Email } from '../models/email';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {

    constructor(private functions: AngularFireFunctions) {
    }

    sendEmail(email: Email): Observable<any> {
        const sendEmailFunction = this.functions.httpsCallable('sendEmail');
        return sendEmailFunction({email: email});
    }
}
