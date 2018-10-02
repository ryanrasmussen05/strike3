import { GameData } from '../models/game.data';
import { Pick, PickStatus } from '../models/pick';
import { TieBreaker } from '../models/tie.breaker';
import { Player } from '../models/player';
import * as clone from 'clone';

export function CanUserAccessAdmin(gameData: GameData, uid: string): boolean {
    if (!gameData || !uid) return false;

    const foundPlayer = gameData.players.get(uid);

    if (!foundPlayer) return false;

    return foundPlayer.admin;
}

export function CanUserAccessSuperuser(gameData: GameData, uid: string): boolean {
    if (!gameData || !uid) return false;

    const foundPlayer = gameData.players.get(uid);

    if (!foundPlayer) return false;

    return foundPlayer.superuser;
}

export function ConvertServiceGameData(serviceGameData: any): GameData {
    const gameData: GameData = {
        week: serviceGameData.week,
        players: buildMap(serviceGameData.players, false),
        schedule: buildMap(serviceGameData.schedule, true),
        tieBreakers: buildMap(serviceGameData.tieBreakers, true)
    };

    gameData.players.forEach((currentPlayer) => {
        currentPlayer.picks = buildMap(currentPlayer.picks, true);
    });

    return gameData;
}

export function GetAvailableTeamsForPlayerAndWeek(gameData: GameData, uid: string, week: number): string[] {
    const teamsYetToPlay = filterTeamsForCurrentTime(gameData, week);
    const previousTeams = getPreviousTeamsForPlayer(gameData, uid, week);

    return teamsYetToPlay.filter((teamYetToPlay) => {
        const foundPreviousTeam = previousTeams.find((previousTeam) => {
            return previousTeam === teamYetToPlay;
        });

        return !foundPreviousTeam;
    });
}

export function AddOrUpdatePick(gameData: GameData, pick: Pick, uid: string): GameData {
    const updatedGameData: GameData = clone(gameData);

    const existingPick = updatedGameData.players.get(uid).picks.get(pick.week);

    if (existingPick) {
        Object.assign(existingPick, pick);
        updatedGameData.players.get(uid).picks.set(pick.week, existingPick);
    } else {
        updatedGameData.players.get(uid).picks.set(pick.week, pick);
    }

    return updatedGameData;
}

export function ReadyToMakeWeekPublic(gameData: GameData): boolean {
    const week: number = gameData.week.weekNumber;
    const tieBreaker: TieBreaker = gameData.tieBreakers.get(week);

    let allPicksIn: boolean = true;

    for (const player of Array.from(gameData.players.values())) {

        if (!isPlayerEliminated(player)) {

            const pick: Pick = player.picks.get(week);

            if (!pick || !pick.team || (!!tieBreaker && !pick.tieBreakerTeam)) {
                allPicksIn = false;
                break;
            }
        }
    }

    return allPicksIn;
}

export function GetOpenPicks(gameData: GameData): [Pick, string][] {
    const openPicks: [Pick, string][] = [];

    gameData.players.forEach((currentPlayer) => {
        currentPlayer.picks.forEach((currentPick) => {
            if (currentPick.status === PickStatus.Open) {
                openPicks.push([currentPick, currentPlayer.uid]);
            }
        });
    });

    return openPicks;
}

export function GetDaysToUpdateScores(gameData: GameData, openPicks: [Pick, string][]): string[] {
    const dateStrings: string[] = [];

    openPicks.forEach((currentPick) => {
        const dateString = getDateStringForPick(gameData, currentPick[0]);

        if (dateString && dateStrings.indexOf(dateString) < 0) {
            dateStrings.push(dateString);
        }
    });

    return dateStrings;
}

function buildMap(obj, isKeyNumber: boolean) {
    const map = new Map();
    if (obj) {
        Object.keys(obj).forEach(key => {
            if (isKeyNumber) {
                map.set(parseInt(key), obj[key]);
            } else {
                map.set(key, obj[key]);
            }
        });
    }
    return map;
}

function filterTeamsForCurrentTime(gameData: GameData, week: number): string[] {
    const currentTime = new Date().getTime();
    const availableTeams: string[] = [];

    gameData.schedule.get(week).forEach((currentNflGame) => {
        if (currentTime < currentNflGame.time) {
            availableTeams.push(currentNflGame.homeTeam, currentNflGame.awayTeam);
        }
    });

    return availableTeams;
}

function getPreviousTeamsForPlayer(gameData: GameData, uid: string, week: number): string[] {
    const previousTeams: string[] = [];

    const playerPicks: Map<number, Pick> = gameData.players.get(uid).picks;

    for (let index = 1; index < week; index++) {
        const pick = playerPicks.get(index);
        if (pick) {
            previousTeams.push(pick.team);
        }
    }

    return previousTeams;
}

function isPlayerEliminated(player: Player): boolean {
    let strikes: number = 0;

    for (const pick of Array.from(player.picks.values())) {
        if (pick.status === PickStatus.Loss) {
            strikes = strikes + 1;
        } else if (pick.status === PickStatus.Tie) {
            strikes = strikes + 0.5;
        }
    }

    return strikes >= 3;
}

function getDateStringForPick(gameData: GameData, pick: Pick): string {
    const nflGames = gameData.schedule.get(pick.week);

    const nflGame = nflGames.find((currentNflGame) => {
        return currentNflGame.homeTeam === pick.team || currentNflGame.awayTeam === pick.team;
    });

    if (nflGame) {
        const date = new Date(nflGame.time);
        const yearString: string = date.getFullYear().toString();

        const month = date.getMonth() + 1;
        const monthString: string = month.toString().length > 1 ? month.toString() : '0' + month.toString();

        const dayString: string = date.getDate().toString();

        return yearString + monthString + dayString;
    }
}



