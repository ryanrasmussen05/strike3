import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

interface Attachment {
    filename: string;
    url: string;
}

@Injectable()
export class EmailService {
    constructor() {
    }

    uploadAttachmentAndSend(file: File): Promise<void> {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);

        return fileRef.put(file).then(() => {
            return fileRef.getDownloadURL().then((url) => {
                return this.sendEmail({ filename: file.name, url: url });
            });
        });
    }

    sendEmail(attachment?: Attachment): Promise<void> {
        const sendEmailFunction = firebase.functions().httpsCallable('sendEmail');

        return sendEmailFunction({ attachment: attachment }).then((result) => {
            console.log('Email send result: ', result);
        });
    }
}

