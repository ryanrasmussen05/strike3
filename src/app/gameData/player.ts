import { Pick } from './pick';

export interface Player {
    name: string;
    email: string;
    admin?: boolean;
    superuser?: boolean;
    uid: string;
    picks: Map<number, Pick>;
}
