export interface Email {
    subject: string;
    recipients: string[];
    body: string;
    attachment?: Attachment;
}

export interface Attachment {
    filename: string;
    url: string;
}
