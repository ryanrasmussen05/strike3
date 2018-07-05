import { Week } from '../gameData/week';
import { PickStatus } from '../gameData/pick';
import { TieBreaker } from '../gameData/tie.breaker';

export interface Strike3Pick {
    week: number;
    team?: string;
    canEdit: boolean;
    uid: string;
    playerName: string;
    status: PickStatus;
    tieBreakerTeam?: string;
    tieBreakerPoints?: number;
    eliminated?: boolean;
}

export interface Strike3Player {
    name: string;
    email: string;
    picks: Strike3Pick[];
    signedIn?: boolean;
    strikes: number;
    admin: boolean;
    uid: string;
    rank: number;
}

export interface Strike3Game {
    players: Strike3Player[];
    week: Week;
    tieBreakers: Map<number, TieBreaker>;
}
