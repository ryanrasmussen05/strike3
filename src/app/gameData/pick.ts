export interface Pick {
  week: number;
  team?: string;
  status?: PickStatus;
  time?: number;
}

export enum PickStatus {
  Win = 'WIN',
  Loss = 'LOSS',
  Tie = 'TIE',
  Open = 'OPEN'
}
