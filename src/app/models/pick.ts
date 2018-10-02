export interface Pick {
    week: number;
    team?: string;
    status?: PickStatus;
    time?: number;
    tieBreakerTeam?: string;
    tieBreakerPoints?: number;
}

export enum PickStatus {
    Win = 'WIN',
    Loss = 'LOSS',
    Tie = 'TIE',
    Open = 'OPEN'
}
