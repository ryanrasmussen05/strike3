import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameDataModel } from '../../../gameData/game.data.model';
import { Subscription } from 'rxjs';
import { TieBreaker } from '../../../gameData/tie.breaker';
import { GameData } from '../../../gameData/game.data';
import { GameDataService } from '../../../gameData/game.data.service';

@Component({
    selector: 'app-tie-breaker',
    templateUrl: './tie.breaker.component.html',
    styleUrls: ['./tie.breaker.component.scss']
})
export class TieBreakerComponent implements OnInit, OnDestroy {
    tieBreakers: TieBreaker[] = [];
    selectedTieBreaker: TieBreaker;
    gameDataSubscription: Subscription;

    constructor(public gameDataModel: GameDataModel, public gameDataService: GameDataService) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.gameDataModel.gameData$.subscribe((gameData) => {
            this.tieBreakers = this._parseTieBreakers(gameData);
        });
    }

    ngOnDestroy() {
        this.gameDataSubscription.unsubscribe();
    }

    openTieBreakerModal() {
        $('#tiebreaker-modal').foundation('open');
    }

    setResult(tieBreaker: TieBreaker) {
        this.selectedTieBreaker = tieBreaker;
        $('#tiebreaker-result-modal').foundation('open');
    }

    deleteTieBreaker(tieBreaker: TieBreaker) {
        this.gameDataService.deleteTieBreaker(tieBreaker);
    }

    private _parseTieBreakers(gameData: GameData): TieBreaker[] {
        const tieBreakers = [];

        gameData.tieBreakers.forEach((tieBreaker: TieBreaker, week: number) => {
            tieBreakers.push(tieBreaker);
        });

        tieBreakers.sort((a: TieBreaker, b: TieBreaker) => {
            return (a.week - b.week);
        });

        return tieBreakers;
    }
}
