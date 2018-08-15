"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const gmailEmail = 'denisonstrike3@gmail.com';
const gmailPassword = 'strike3_2018';
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});
exports.sendEmail = functions.https.onCall((data) => {
    data.email.recipients.push(gmailEmail);
    const mailOption = {
        from: { name: 'Strike 3', address: gmailEmail },
        to: data.email.recipients,
        subject: data.email.subject,
        html: '<p>' + data.email.body + '</p><p>Do not respond to this message. If needed, contact Gary directly at denisongl@yahoo.com</p><a href="https://denisonstrike3.com">www.denisonstrike3.com</a>'
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
//# sourceMappingURL=index.js.map