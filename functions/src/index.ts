import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

export const sendEmail = functions.https.onCall((data) => {
    const mailOption: Mail.Options = {
        from: { name: 'Strike 3', address: gmailEmail },
        to: ['ryanrasmussen05@gmail.com', gmailEmail],
        subject: 'This Is A Test',
        text: 'This is where the text for the message will go. Blah Blah Blah'
    };

    if (data.attachment) {
        mailOption.attachments = [{
           filename: data.attachment.filename,
           path: data.attachment.url
        }];
    }

    mailTransport.sendMail(mailOption).then(() => {
        console.log('sent email');
    }).catch((error) => {
        console.error(error);
    });
});
