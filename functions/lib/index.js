"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});
exports.sendEmail = functions.https.onCall((data) => {
    const mailOption = {
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
//# sourceMappingURL=index.js.map