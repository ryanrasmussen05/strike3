import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameData } from '../../models/game.data';
import { PlayerLog } from '../../models/pick.log';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { GameDataSelector } from '../../reducers/game.data.reducer';

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

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.gameData = gameData;
            this.selectedWeek = gameData.week.weekNumber;
            this.playerLogs = [];
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
