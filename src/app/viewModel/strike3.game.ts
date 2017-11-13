import { Week } from '../gameData/week';

export interface Strike3Pick {
  week: number;
  team?: string;
  canEdit: boolean;
  win?: boolean;
  uid: string;
  playerName: string;
}

export interface Strike3Player {
  name: string;
  picks: Strike3Pick[];
  signedIn?: boolean;
}

export interface Strike3Game {
  players: Strike3Player[];
  week: Week;
}
