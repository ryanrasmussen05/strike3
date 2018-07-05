import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TieBreaker } from '../../../gameData/tie.breaker';
import { GameDataModel } from '../../../gameData/game.data.model';
import { GameDataService } from '../../../gameData/game.data.service';
import { ContextModel } from '../../context.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tie-breaker-result',
    templateUrl: './tie.breaker.result.html'
})
export class TieBreakerResultComponent implements OnInit, OnDestroy {
    selectedTieBreaker: TieBreaker;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;

    contextSubscription: Subscription;

    constructor(public gameDataService: GameDataService, public gameDataModel: GameDataModel, public contextModel: ContextModel) {
    }

    ngOnInit() {
        this.contextSubscription = this.contextModel.contextTieBreaker$.subscribe((tieBreaker: TieBreaker) => {
            this.selectedTieBreaker = Object.create(tieBreaker);
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
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
