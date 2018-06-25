import { Component, Input } from '@angular/core';
import { TieBreaker } from '../../../gameData/tie.breaker';
import { GameDataModel } from '../../../gameData/game.data.model';
import { GameDataService } from '../../../gameData/game.data.service';

@Component({
    selector: 'app-tie-breaker-result',
    templateUrl: './tie.breaker.result.html'
})
export class TieBreakerResultComponent {

    @Input('tieBreaker') set tieBreaker(value: TieBreaker) {
        if (value) {
            this.selectedTieBreaker = Object.create(value);
        }
    }

    selectedTieBreaker: TieBreaker;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;

    constructor(public gameDataService: GameDataService, public gameDataModel: GameDataModel) {
    }

    submitResult() {
        this.loading = true;
        this.error = false;

        this.selectedTieBreaker.winningTeam = this.winningTeam;
        this.selectedTieBreaker.points = this.totalPoints;

        this.gameDataService.submitTieBreaker(this.selectedTieBreaker).then(() => {
            this.loading = false;
            this._closeModal();
        }).catch((error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    private _closeModal() {
        $('#tiebreaker-result-modal').foundation('close');
    }
}
