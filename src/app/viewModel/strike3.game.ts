export interface Strike3Pick {
  week: number;
  team?: string;
  canEdit: boolean;
  win?: boolean;
}

export interface Strike3Player {
  name: string;
  picks: Strike3Pick[];
}

export interface Strike3Game {
  players: Strike3Player[];
}
