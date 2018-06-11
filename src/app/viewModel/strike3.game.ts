import { Week } from '../gameData/week';
import { PickStatus } from '../gameData/pick';

export interface Strike3Pick {
    week: number;
    team?: string;
    canEdit: boolean;
    uid: string;
    playerName: string;
    status: PickStatus;
    eliminated?: boolean;
}

export interface Strike3Player {
    name: string;
    picks: Strike3Pick[];
    signedIn?: boolean;
    strikes: number;
    admin: boolean;
}

export interface Strike3Game {
    players: Strike3Player[];
    week: Week;
}
