import { NFLServiceSchedule } from '../nfl/nfl.service.schedule';
import * as moment from 'moment-timezone';

export interface NFLGame {
  homeTeam: string;
  awayTeam: string;
  time: number;
  timeString: string;
}

export class NFLScheduleUtil {

  static ParseFromService(nflServiceSchedule: NFLServiceSchedule): Map<number, NFLGame[]> {
    const weeks = new Map<number, NFLGame[]>();

    nflServiceSchedule.fullgameschedule.gameentry.forEach((nflServiceGame) => {
      const week = parseInt(nflServiceGame.week);

      let homeTeam = nflServiceGame.homeTeam.Abbreviation;
      let awayTeam = nflServiceGame.awayTeam.Abbreviation;

      homeTeam = NFLScheduleUtil.UpdateTeamAbbreviations(homeTeam);
      awayTeam = NFLScheduleUtil.UpdateTeamAbbreviations(awayTeam);

      const timeString = moment(nflServiceGame.time, ['h:mm A']).format('HH:mm');
      const dateTimeString = nflServiceGame.date + ' ' + timeString;
      const gameMoment = moment.tz(dateTimeString, 'America/New_York');

      const nflGame: NFLGame = {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        time: gameMoment.valueOf(),
        timeString: new Date(gameMoment.valueOf()).toLocaleString()
      };

      if (weeks.get(week)) {
        weeks.get(week).push(nflGame);
      } else {
        weeks.set(week, [nflGame]);
      }
    });

    return weeks;
  }

  static UpdateTeamAbbreviations(team: string): string {
    if (team === 'ARI') return 'ARZ';
    if (team === 'LA') return 'LAR';
    return team;
  }

  static ToJson(nflSchedule: Map<number, NFLGame[]>): any {
    const convertedWeeks: Object = Array.from(nflSchedule).reduce((obj, [key, value]) => (
      Object.assign(obj, {[key.toString()]: value})
    ), {});

    return convertedWeeks;
  }
}

