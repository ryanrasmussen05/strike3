export interface Pick {
  week: number;
  uid: string;
  team?: string;
  status?: PickStatus;
}

export enum PickStatus {
  Win = 'WIN',
  Loss = 'LOSS',
  Tie = 'TIE',
  Open = 'OPEN'
}
