export interface Email {
    subject: string;
    recipients: string[];
    body: string;
    file?: File;
    attachment?: Attachment;
}

export interface Attachment {
    filename: string;
    url: string;
}
