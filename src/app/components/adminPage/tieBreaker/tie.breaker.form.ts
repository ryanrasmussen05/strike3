import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

    selectedWeek: string = '';
    selectedGame: NFLGame;

    error: boolean = false;
    loading: boolean = false;

    gameDataSubscription: Subscription;

    constructor(public gameDataModel: GameDataModel, public gameDataService: GameDataService) {
    }

    ngOnInit() {
        $('#tiebreaker-modal').on('open.zf.reveal', () => {
            this.gameDataSubscription = this.gameDataModel.gameData$.subscribe((gameData) => {
                this.gameData = gameData;
                this._getAvailableWeeks(gameData);
            });
        });

        $('#tiebreaker-modal').on('closed.zf.reveal', () => {
            this.selectedWeek = null;
            this.selectedGame = null;
        });
    }

    ngOnDestroy() {
        this.gameDataSubscription.unsubscribe();
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

    private _getAvailableWeeks(gameData: GameData) {
        const openWeeks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        gameData.tieBreakers.forEach((tieBreaker: TieBreaker) => {
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
