import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameDataModel } from '../../../gameData/game.data.model';
import { Subscription } from 'rxjs';
import { GameData } from '../../../gameData/game.data';
import { PlayerLog } from './pick.log';

@Component({
    selector: 'app-pick-log',
    templateUrl: './pick.log.component.html',
    styleUrls: ['./pick.log.component.scss']
})
export class PickLogComponent implements OnInit, OnDestroy {
    selectedWeek: any;
    gameData: GameData;
    playerLogs: PlayerLog[];

    gameDataSubscription: Subscription;

    constructor(public gameDataModel: GameDataModel) {
    }

    ngOnInit() {
        this.selectedWeek = this.gameDataModel.gameData$.getValue().week.weekNumber;
        this.playerLogs = [];

        this.gameDataSubscription = this.gameDataModel.gameData$.subscribe((gameData) => {
            this.gameData = gameData;
            this._buildModelForWeek();
        });
    }

    ngOnDestroy() {
        this.gameDataSubscription.unsubscribe();
    }

    weekChange() {
        this.selectedWeek = parseInt(this.selectedWeek);
        this._buildModelForWeek();
    }

    private _buildModelForWeek() {
        const playerLogs: PlayerLog[] = [];

        this.gameData.players.forEach((currentPlayer) => {

            const pick = currentPlayer.picks.get(this.selectedWeek);

            if (pick && pick.team) {
                const playerLog: PlayerLog = {
                    playerName: currentPlayer.name,
                    team: pick.team,
                    time: new Date(pick.time)
                };

                playerLogs.push(playerLog);
            }
        });

        this._sortPlayerLogs(playerLogs);
        this.playerLogs = playerLogs;
    }

    private _sortPlayerLogs(playerLogs: PlayerLog[]) {
        playerLogs.sort((a, b) => {
            if (a.playerName < b.playerName) return -1;
            if (a.playerName > b.playerName) return 1;
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });
    }
}
