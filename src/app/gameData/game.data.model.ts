import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Week } from './week';
import { GameData } from './game.data';
import { Pick, PickStatus } from './pick';
import { NFLGame } from './nfl.schedule';
import { TieBreaker } from './tie.breaker';
import { Player } from './player';

@Injectable()
export class GameDataModel {
    gameData$: BehaviorSubject<GameData> = new BehaviorSubject<GameData>(null);

    setGameData(gameData: GameData) {
        console.log('set game data');
        this.gameData$.next(gameData);
    }

    setWeek(week: Week) {
        console.log('set week');

        const gameData = this.gameData$.getValue();

        if (!gameData) return false;

        const updatedGameData = Object.create(gameData);
        updatedGameData.week = week;

        this.gameData$.next(updatedGameData);
    }

    setNflSchedule(nflSchedule: Map<number, NFLGame[]>) {
        console.log('set schedule');

        const updatedGameData: GameData = Object.create(this.gameData$.getValue());
        updatedGameData.schedule = nflSchedule;

        this.gameData$.next(updatedGameData);
    }

    addOrUpdatePick(pick: Pick, uid: string) {
        console.log('add pick');

        const updatedGameData: GameData = Object.create(this.gameData$.getValue());

        const existingPick = updatedGameData.players.get(uid).picks.get(pick.week);

        if (existingPick) {
            Object.assign(existingPick, pick);
            updatedGameData.players.get(uid).picks.set(pick.week, existingPick);
        } else {
            updatedGameData.players.get(uid).picks.set(pick.week, pick);
        }

        this.gameData$.next(updatedGameData);
    }

    addOrUpdateTieBreaker(tieBreaker: TieBreaker) {
        console.log('add tie breaker');

        const updatedGameData: GameData = Object.create(this.gameData$.getValue());
        updatedGameData.tieBreakers.set(tieBreaker.week, tieBreaker);

        this.gameData$.next(updatedGameData);
    }

    removeTieBreaker(tieBreaker: TieBreaker) {
        console.log('remove tie breaker');

        const updatedGameData: GameData = Object.create(this.gameData$.getValue());
        updatedGameData.tieBreakers.delete(tieBreaker.week);

        this.gameData$.next(updatedGameData);
    }

    canAccessAdmin(uid: string): boolean {
        const gameData = this.gameData$.getValue();

        if (!gameData || !uid) return false;

        const foundPlayer = gameData.players.get(uid);

        if (!foundPlayer) return false;

        return foundPlayer.admin;
    }

    canAccessSuperuser(uid: string): boolean {
        const gameData = this.gameData$.getValue();

        if (!gameData || !uid) return false;

        const foundPlayer = gameData.players.get(uid);

        if (!foundPlayer) return false;

        return foundPlayer.superuser;
    }

    getAvailableTeamsForPlayerAndWeek(uid: string, week: number): string[] {
        const teamsYetToPlay = this._filterTeamsForCurrentTime(week);
        const previousTeams = this._getPreviousTeamsForPlayer(uid, week);

        return teamsYetToPlay.filter((teamYetToPlay) => {
            const foundPreviousTeam = previousTeams.find((previousTeam) => {
                return previousTeam === teamYetToPlay;
            });

            return !foundPreviousTeam;
        });
    }

    readyToMakeWeekPublic(): boolean {
        const gameData: GameData = this.gameData$.getValue();
        const week: number = gameData.week.weekNumber;
        const tieBreaker: TieBreaker = gameData.tieBreakers.get(week);

        let allPicksIn: boolean = true;

        for (const player of Array.from(gameData.players.values())) {

            if (!this._isPlayerEliminated(player)) {

                const pick: Pick = player.picks.get(week);

                if (!pick || !pick.team || (!!tieBreaker && !pick.tieBreakerTeam)) {
                    allPicksIn = false;
                    break;
                }
            }
        }

        return allPicksIn;
    }

    updatePlayerName(uid: string, name: string) {
        console.log('updating player name in game data');

        const updatedGameData: GameData = Object.create(this.gameData$.getValue());

        const playerToUpdate = updatedGameData.players.get(uid);

        if (playerToUpdate) {
            playerToUpdate.name = name;
        }

        this.gameData$.next(updatedGameData);
    }

    private _isPlayerEliminated(player: Player): boolean {
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

    private _filterTeamsForCurrentTime(week: number): string[] {
        const currentTime = new Date().getTime();
        const availableTeams: string[] = [];

        this.gameData$.getValue().schedule.get(week).forEach((currentNflGame) => {
            if (currentTime < currentNflGame.time) {
                availableTeams.push(currentNflGame.homeTeam, currentNflGame.awayTeam);
            }
        });

        return availableTeams;
    }

    private _getPreviousTeamsForPlayer(uid: string, week: number): string[] {
        const previousTeams: string[] = [];

        const playerPicks: Map<number, Pick> = this.gameData$.getValue().players.get(uid).picks;

        for (let index = 1; index < week; index++) {
            const pick = playerPicks.get(index);
            if (pick) {
                previousTeams.push(pick.team);
            }
        }

        return previousTeams;
    }
}
