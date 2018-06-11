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
