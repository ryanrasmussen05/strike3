import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TieBreaker } from '../../models/tie.breaker';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { GameData } from '../../models/game.data';
import { SetContextTieBreaker } from '../../actions/context.actions';
import { DeleteTieBreaker } from '../../actions/tie.breaker.actions';
import { BsModalService } from 'ngx-bootstrap';
import { TieBreakerFormComponent } from './tie.breaker.form';
import { TieBreakerResultComponent } from './tie.breaker.result';

@Component({
    selector: 'app-tie-breaker',
    templateUrl: './tie.breaker.component.html',
    styleUrls: ['./tie.breaker.component.scss']
})
export class TieBreakerComponent implements OnInit, OnDestroy {
    tieBreakers: TieBreaker[] = [];
    gameDataSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalService: BsModalService) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.tieBreakers = this._parseTieBreakers(gameData);
        });
    }

    ngOnDestroy() {
        this.gameDataSubscription.unsubscribe();
    }

    setResult(tieBreaker: TieBreaker) {
        this.store.dispatch(new SetContextTieBreaker(tieBreaker));
        this.modalService.show(TieBreakerResultComponent);
    }

    deleteTieBreaker(tieBreaker: TieBreaker) {
        this.store.dispatch(new DeleteTieBreaker(tieBreaker));
    }

    openAddTieBreakerModal() {
        this.modalService.show(TieBreakerFormComponent);
    }

    private _parseTieBreakers(gameData: GameData): TieBreaker[] {
        const tieBreakers = [];

        gameData.tieBreakers.forEach((tieBreaker: TieBreaker) => {
            tieBreakers.push(tieBreaker);
        });

        tieBreakers.sort((a: TieBreaker, b: TieBreaker) => {
            return (a.week - b.week);
        });

        return tieBreakers;
    }
}
