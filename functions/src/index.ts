import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

interface Email {
    subject: string;
    recipients: string[];
    body: string;
    attachment?: Attachment;
}

interface Attachment {
    filename: string;
    url: string;
}

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

export const sendEmail = functions.https.onCall((data: {email: Email}) => {
    data.email.recipients.push(gmailEmail);

    const mailOption: Mail.Options = {
        from: { name: 'Strike 3', address: gmailEmail },
        to: data.email.recipients,
        subject: data.email.subject,
        text: data.email.body
    };

    if (data.email.attachment) {
        mailOption.attachments = [{
           filename: data.email.attachment.filename,
           path: data.email.attachment.url
        }];
    }

    mailTransport.sendMail(mailOption).then(() => {
        console.log('sent email');
    }).catch((error) => {
        console.error(error);
    });
});