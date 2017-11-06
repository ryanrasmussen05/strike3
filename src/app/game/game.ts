export interface GamePick {
  week: number;
  team: string;
  canEdit: boolean;
  win?: boolean;
}

export interface GamePlayer {
  name: string;
  picks: GamePick[];
}

export interface Game {
  players: GamePlayer[];
}
