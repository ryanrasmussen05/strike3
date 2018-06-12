import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

@Injectable()
export class EmailService {
    constructor() {
    }

    sendEmail(): void {
        const getDateFunction = firebase.functions().httpsCallable('getDate');

        getDateFunction().then((result) => {
            console.log(result);
        }).catch((error) => {
            console.error(error);
        });
    }
}

