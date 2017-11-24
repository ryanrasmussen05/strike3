import { PickStatus } from './pick';
import { NFLServiceScoreboard } from '../nfl/nfl.service.scoreboard';
import { NFLScheduleUtil } from './nfl.schedule';

export type NFLScoreboard = Map<number, NFLWeekScoreboard>;
export type NFLWeekScoreboard = Map<string, PickStatus>;

export class NFLScoreboardUtil {

  static ParseFromService(nflServiceScoreboard: NFLServiceScoreboard): NFLScoreboard {
    const nflScoreboard = new Map<number, NFLWeekScoreboard>();

    if (!nflServiceScoreboard.scoreboard.gameScore) return nflScoreboard;

    nflServiceScoreboard.scoreboard.gameScore.forEach((currentGameScore) => {
      const week = parseInt(currentGameScore.game.week);
      const homeScore = parseInt(currentGameScore.homeScore);
      const awayScore = parseInt(currentGameScore.awayScore);

      if (!nflScoreboard.get(week)) {
        nflScoreboard.set(week, new Map<string, PickStatus>());
      }

      if (homeScore > awayScore) {
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Win);
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Loss);
      } else if (homeScore < awayScore) {
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Loss);
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Win);
      } else {
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Tie);
        nflScoreboard.get(week).set(NFLScheduleUtil.UpdateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Tie);
      }
    });

    return nflScoreboard;
  }

  static MergeScoreboards(scoreboards: NFLScoreboard[]): NFLScoreboard {
    const mergedScoreboard = new Map<number, NFLWeekScoreboard>();

    scoreboards.forEach((currentScoreboard) => {
      currentScoreboard.forEach((currentWeekScoreboard: NFLWeekScoreboard, currentWeek: number) => {
        if (!mergedScoreboard.get(currentWeek)) {
          mergedScoreboard.set(currentWeek, new Map<string, PickStatus>());
        }

        currentWeekScoreboard.forEach((status: PickStatus, team: string) => {
          mergedScoreboard.get(currentWeek).set(team, status);
        });
      });
    });

    return mergedScoreboard;
  }

}

