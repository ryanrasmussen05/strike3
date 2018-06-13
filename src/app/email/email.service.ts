import { Injectable } from '@angular/core';
import { Email } from './email';

import * as firebase from 'firebase/app';

@Injectable()
export class EmailService {
    constructor() {
    }

    sendEmail(email: Email): Promise<firebase.functions.HttpsCallableResult> {
        if (email.file) {
            return this._uploadAttachmentAndSend(email);
        } else {
            return this._sendEmail(email);
        }
    }

    private _uploadAttachmentAndSend(email: Email): Promise<firebase.functions.HttpsCallableResult> {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(email.file.name);

        return fileRef.put(email.file).then(() => {
            return fileRef.getDownloadURL().then((url) => {

                email.attachment = { filename: email.file.name, url: url };
                email.file = null; //don't send this to firebase again

                return this.sendEmail(email);
            });
        });
    }

    private _sendEmail(email: Email): Promise<firebase.functions.HttpsCallableResult> {
        const sendEmailFunction = firebase.functions().httpsCallable('sendEmail');

        return sendEmailFunction({ email: email });
    }
}

