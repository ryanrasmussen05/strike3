import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameDataModel } from '../../../gameData/game.data.model';
import { GameData } from '../../../gameData/game.data';
import { TieBreaker } from '../../../gameData/tie.breaker';
import { NFLGame } from '../../../gameData/nfl.schedule';
import { GameDataService } from '../../../gameData/game.data.service';

@Component({
    selector: 'app-tie-breaker-form',
    templateUrl: './tie.breaker.form.html'
})
export class TieBreakerFormComponent implements OnInit, OnDestroy {
    gameData: GameData;
    availableWeeks: number[] = [];
    availableGames: NFLGame[] = null;

    selectedWeek: string = null;
    selectedGame: NFLGame = null;

    error: boolean = false;
    loading: boolean = false;

    constructor(public gameDataModel: GameDataModel, public gameDataService: GameDataService, public zone: NgZone) {
    }

    ngOnInit() {
        $('#tiebreaker-modal').on('open.zf.reveal', () => {
            this.zone.run(() => {
                this.gameData = this.gameDataModel.gameData$.getValue();
                this._getAvailableWeeks();
            });
        });

        $('#tiebreaker-modal').on('closed.zf.reveal', () => {
            this.zone.run(() => {
                this.selectedWeek = null;
                this.selectedGame = null;
            });
        });
    }

    ngOnDestroy() {
        $('#tiebreaker-modal').off('open.zf.reveal closed.zf.reveal');
    }

    getGamesForWeek() {
        this.availableGames = this.gameData.schedule.get(parseInt(this.selectedWeek));
        this.selectedGame = this.availableGames[0];
    }

    submitTieBreaker() {
        this.loading = true;
        this.error = false;

        const tieBreaker: TieBreaker = {
            week: parseInt(this.selectedWeek),
            homeTeam: this.selectedGame.homeTeam,
            awayTeam: this.selectedGame.awayTeam
        };

        this.gameDataService.submitTieBreaker(tieBreaker).then(() => {
            this.loading = false;
            this._closeModal();
        }).catch((error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    private _getAvailableWeeks() {
        const openWeeks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        this.gameData.tieBreakers.forEach((tieBreaker: TieBreaker) => {
            if (openWeeks.indexOf(tieBreaker.week) >= 0) {
                openWeeks.splice(openWeeks.indexOf(tieBreaker.week), 1);
            }
        });

        this.availableWeeks = openWeeks;
    }

    private _closeModal() {
        $('#tiebreaker-modal').foundation('close');
    }
}
