import { Week } from './week';
import { Player } from './player';
import { NFLGame } from './nfl.schedule';
import { TieBreaker } from './tie.breaker';

export interface GameData {
    week: Week;
    players: Map<string, Player>;
    schedule: Map<number, NFLGame[]>;
    tieBreakers: Map<number, TieBreaker>;
}
