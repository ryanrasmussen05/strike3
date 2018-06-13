import { Injectable } from '@angular/core';
import { GameDataModel } from './game.data.model';
import { Week } from './week';
import { GameData } from './game.data';
import { Pick, PickStatus } from './pick';
import { NFLGame, NFLScheduleUtil } from './nfl.schedule';
import { NFLService } from '../nfl/nfl.service';
import { NFLScoreboardUtil } from './nfl.scoreboard';

import * as firebase from 'firebase/app';

@Injectable()
export class GameDataService {

    constructor(public gameDataModel: GameDataModel, public nflService: NFLService) {
    }

    getGameData(): Promise<GameData> {
        return firebase.database().ref('/').once('value').then((value: firebase.database.DataSnapshot) => {

            const serviceGameData: GameData = value.val();

            //we need to convert JS objects to ES6 Maps
            const gameData: GameData = {
                week: serviceGameData.week,
                players: this._buildMap(serviceGameData.players, false),
                schedule: this._buildMap(serviceGameData.schedule, true)
            };

            gameData.players.forEach((currentPlayer) => {
                currentPlayer.picks = this._buildMap(currentPlayer.picks, true);
            });

            this.gameDataModel.setGameData(gameData);

            return gameData;
        });
    }

    addPlayerForUser(user: firebase.User): Promise<any> {
        const userEntry = {
            name: user.displayName,
            email: user.email,
            uid: user.uid
        };

        return firebase.database().ref('players/' + user.uid).set(userEntry);
    }

    setWeek(week: Week): Promise<void> {
        return firebase.database().ref('week').set(week).then(() => {
            this.gameDataModel.setWeek(week);
        });
    }

    submitPick(pick: Pick, uid: string): Promise<void> {
        return firebase.database().ref('players/' + uid + '/picks/' + pick.week).update(pick).then(() => {
            this.gameDataModel.addOrUpdatePick(pick, uid);
        });
    }

    setSchedule(nflSchedule: Map<number, NFLGame[]>): Promise<void> {
        return firebase.database().ref('schedule').set(NFLScheduleUtil.ToJson(nflSchedule)).then(() => {
            this.gameDataModel.setNflSchedule(nflSchedule);
        });
    }

    updateResults(): Promise<any> {
        const openPicks = this._getOpenPicks();
        const daysToUpdate = this._getDaysToUpdateScores(openPicks);
        const updatePromises = [];

        daysToUpdate.forEach((dayToUpdate) => {
            updatePromises.push(this.nflService.getScoreboardForDate(dayToUpdate));
        });

        return Promise.all(updatePromises).then((values) => {
            const scoreboard = NFLScoreboardUtil.MergeScoreboards(values);
            const pickUpdatePromises = [];

            openPicks.forEach((openPickTuple) => {
                const pick = openPickTuple[0];
                const uid = openPickTuple[1];

                if (scoreboard.get(pick.week) && scoreboard.get(pick.week).get(pick.team)) {
                    pick.status = scoreboard.get(pick.week).get(pick.team);
                    pickUpdatePromises.push(this.submitPick(pick, uid));
                }
            });

            return Promise.all(pickUpdatePromises);
        });
    }

    private _getOpenPicks(): [Pick, string][] {
        const openPicks: [Pick, string][] = [];

        this.gameDataModel.gameData$.getValue().players.forEach((currentPlayer) => {
            currentPlayer.picks.forEach((currentPick) => {
                if (currentPick.status === PickStatus.Open) {
                    openPicks.push([currentPick, currentPlayer.uid]);
                }
            });
        });

        return openPicks;
    }

    private _getDaysToUpdateScores(openPicks: [Pick, string][]): string[] {
        const dateStrings: string[] = [];

        openPicks.forEach((currentPick) => {
            const dateString = this._getDateStringForPick(currentPick[0]);

            if (dateString && dateStrings.indexOf(dateString) < 0) {
                dateStrings.push(dateString);
            }
        });

        console.log('Updating results for dates: ', dateStrings);

        return dateStrings;
    }

    private _getDateStringForPick(pick: Pick): string {
        const nflGames = this.gameDataModel.gameData$.getValue().schedule.get(pick.week);

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

    private _buildMap(obj, isKeyNumber: boolean) {
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
}
