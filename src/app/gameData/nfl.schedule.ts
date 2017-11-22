import { NFLServiceSchedule } from '../nfl/nfl.service.schedule';
import * as moment from 'moment-timezone';

export interface NFLGame {
  homeTeam: string;
  awayTeam: string;
  time: number;
}

export class NFLScheduleUtil {

  static parseFromService(nflServiceSchedule: NFLServiceSchedule): Map<number, NFLGame[]> {
    const weeks = new Map<number, NFLGame[]>();

    nflServiceSchedule.fullgameschedule.gameentry.forEach((nflServiceGame) => {
      const week = parseInt(nflServiceGame.week);
      const homeTeam = nflServiceGame.homeTeam.Abbreviation;
      const awayTeam = nflServiceGame.awayTeam.Abbreviation;

      const timeString = moment(nflServiceGame.time, ['h:mm A']).format('HH:mm');
      const dateTimeString = nflServiceGame.date + ' ' + timeString;
      const gameMoment = moment.tz(dateTimeString, 'America/New_York');

      const nflGame: NFLGame = {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        time: gameMoment.valueOf()
      };

      if (weeks.get(week)) {
        weeks.get(week).push(nflGame);
      } else {
        weeks.set(week, [nflGame]);
      }
    });

    return weeks;
  }

  static ToJson(nflSchedule: Map<number, NFLGame[]>): any {
    const convertedWeeks: Object = Array.from(nflSchedule).reduce((obj, [key, value]) => (
      Object.assign(obj, {[key.toString()]: value})
    ), {});

    return convertedWeeks;
  }
}

