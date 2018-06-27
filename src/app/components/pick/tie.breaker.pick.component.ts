import { Component, Input, NgZone, OnInit } from '@angular/core';
import { TeamModel } from '../../gameData/team.model';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { TieBreaker } from '../../gameData/tie.breaker';
import { GameData } from '../../gameData/game.data';
import { NFLGame } from '../../gameData/nfl.schedule';

@Component({
    selector: 'app-tie-breaker-pick',
    templateUrl: './tie.breaker.pick.component.html'
})
export class TieBreakerPickComponent implements OnInit {

    @Input('tieBreaker') set tieBreaker(value: TieBreaker) {
        if (value) {
            this.selectedTieBreaker = value;
            this.isGameStarted = this._hasGameStarted();
        }
    }

    selectedTieBreaker: TieBreaker;
    isGameStarted: boolean = false;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;

    constructor(public zone: NgZone, public gameDataService: GameDataService, public teamModel: TeamModel,
                public gameDataModel: GameDataModel) {
    }

    ngOnInit() {
        $('#tie-breaker-pick-modal').on('closed.zf.reveal', () => {
            this.zone.run(() => {
                this.winningTeam = '';
                this.totalPoints = null;
                this.error = false;
                this.loading = false;
            });
        });
    }

    private _hasGameStarted(): boolean {
        const gameData: GameData = this.gameDataModel.gameData$.getValue();
        const currentTime = new Date().getTime();

        const game: NFLGame = gameData.schedule.get(gameData.week.weekNumber).find((nflGame: NFLGame) => {
            return this.selectedTieBreaker.awayTeam === nflGame.awayTeam
                && this.selectedTieBreaker.homeTeam === nflGame.homeTeam;
        });

        return currentTime > game.time;
    }

    submitTieBreaker() {
        this._closeModal();
    }

    private _closeModal() {
        $('#tie-breaker-pick-modal').foundation('close');
    }
}
