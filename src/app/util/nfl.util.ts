import { NFLGame, NFLSchedule, NFLScoreboard, NFLServiceSchedule, NFLServiceScoreboard, NFLWeekScoreboard } from '../models/nfl.schedule';
import { PickStatus } from '../models/pick';

declare const moment: any;

export function ConvertNflSchedule(serviceNflSchedule: NFLServiceSchedule): NFLSchedule {
    const weeks = new Map<number, NFLGame[]>();

    serviceNflSchedule.fullgameschedule.gameentry.forEach((nflServiceGame) => {
        const week = parseInt(nflServiceGame.week);

        let homeTeam = nflServiceGame.homeTeam.Abbreviation;
        let awayTeam = nflServiceGame.awayTeam.Abbreviation;

        homeTeam = updateTeamAbbreviations(homeTeam);
        awayTeam = updateTeamAbbreviations(awayTeam);

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

export function ConvertNflScoreboard(nflServiceScoreboard: NFLServiceScoreboard): NFLScoreboard {
    const nflScoreboard = new Map<number, NFLWeekScoreboard>();

    if (!nflServiceScoreboard) return nflScoreboard;
    if (!nflServiceScoreboard.scoreboard.gameScore) return nflScoreboard;

    nflServiceScoreboard.scoreboard.gameScore.forEach((currentGameScore) => {
        const week = parseInt(currentGameScore.game.week);
        const homeScore = parseInt(currentGameScore.homeScore);
        const awayScore = parseInt(currentGameScore.awayScore);

        if (!nflScoreboard.get(week)) {
            nflScoreboard.set(week, new Map<string, PickStatus>());
        }

        if (homeScore > awayScore) {
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Win);
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Loss);
        } else if (homeScore < awayScore) {
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Loss);
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Win);
        } else {
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.homeTeam.Abbreviation), PickStatus.Tie);
            nflScoreboard.get(week).set(updateTeamAbbreviations(currentGameScore.game.awayTeam.Abbreviation), PickStatus.Tie);
        }
    });

    return nflScoreboard;
}

export function MergeScoreboards(scoreboards: NFLScoreboard[]): NFLScoreboard {
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

export function NFLScheduleToJSON(nflSchedule: NFLSchedule): any {
    return Array.from(nflSchedule).reduce((obj, [key, value]) => (
        Object.assign(obj, {[key.toString()]: value})
    ), {});
}

function updateTeamAbbreviations(team: string): string {
    if (team === 'LA') return 'LAR';
    return team;
}
