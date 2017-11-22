import { Week } from './week';
import { Player } from './player';
import { NFLGame } from './nfl.schedule';

export interface GameData {
  week: Week;
  players: Map<string, Player>;
  schedule: Map<number, NFLGame[]>;
}
