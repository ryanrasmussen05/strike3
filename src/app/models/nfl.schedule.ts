import { PickStatus } from './pick';

export type NFLSchedule = Map<number, NFLGame[]>;

export interface NFLGame {
    homeTeam: string;
    awayTeam: string;
    time: number;
    timeString: string;
}

export type NFLScoreboard = Map<number, NFLWeekScoreboard>;

export type NFLWeekScoreboard = Map<string, PickStatus>;

export interface NFLServiceSchedule {
    fullgameschedule: NFLServiceGameSchedule;
}

export interface NFLServiceGameSchedule {
    gameentry: NFLServiceGame[];
}

export interface NFLServiceGame {
    week: string;
    date: string;
    time: string;
    awayTeam: NFLServiceTeam;
    homeTeam: NFLServiceTeam;
}

export interface NFLServiceTeam {
    City: string;
    Name: string;
    Abbreviation: string;
}

export interface NFLServiceScoreboard {
    scoreboard: { gameScore: NFLServiceGameScore[] };
}

export interface NFLServiceGameScore {
    game: NFLServiceGame;
    isCompleted: boolean;
    awayScore: string;
    homeScore: string;
}

export interface NFLServiceGame {
    week: string;
    awayTeam: NFLServiceTeam;
    homeTeam: NFLServiceTeam;
}
