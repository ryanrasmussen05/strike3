import { Week } from './week';
import { Player } from './player';

export interface GameData {
  week: Week;
  players: Map<string, Player>;
}
