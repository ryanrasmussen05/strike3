import { NFLServiceTeam } from './nfl.service.schedule';

export interface NFLServiceScoreboard {
  scoreboard: { gameScore: NFLServiceGameScore[] };
}

export interface NFLServiceGameScore {
  game: NFLServiceGame;
  isCompleted: boolean;
  awayScore: string;
  homeScore: string;
}

export interface NFLServiceGame {
  week: string;
  awayTeam: NFLServiceTeam;
  homeTeam: NFLServiceTeam;
}
