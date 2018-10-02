import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameData } from '../../models/game.data';
import { NFLGame } from '../../models/nfl.schedule';
import { select, Store } from '@ngrx/store';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { Subscription } from 'rxjs';
import { AppState } from '../../reducers';
import { TieBreaker } from '../../models/tie.breaker';
import { TieBreakerState, TieBreakerStateSelector } from '../../reducers/tie.breaker.reducer';
import { CreateTieBreaker, ResetTieBreaker } from '../../actions/tie.breaker.actions';
import { BsModalRef } from 'ngx-bootstrap';

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

    gameDataSubscription: Subscription;
    tieBreakerStateSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalRef: BsModalRef) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.gameData = gameData;
            this._getAvailableWeeks();
        });

        this.tieBreakerStateSubscription = this.store.pipe(select(TieBreakerStateSelector)).subscribe((tieBreakerState: TieBreakerState) => {
            this.loading = tieBreakerState.submitting;
            this.error = !!tieBreakerState.error;

            if (tieBreakerState.submitted) {
                this.closeModal();
                this.store.dispatch(new ResetTieBreaker());
            }
        });
    }

    ngOnDestroy() {
        this.gameDataSubscription.unsubscribe();
        this.tieBreakerStateSubscription.unsubscribe();
    }

    getGamesForWeek() {
        this.availableGames = this.gameData.schedule.get(parseInt(this.selectedWeek));
        this.selectedGame = this.availableGames[0];
    }

    submitTieBreaker() {
        const tieBreaker: TieBreaker = {
            week: parseInt(this.selectedWeek),
            homeTeam: this.selectedGame.homeTeam,
            awayTeam: this.selectedGame.awayTeam
        };

        this.store.dispatch(new CreateTieBreaker(tieBreaker));
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

    closeModal() {
        this.modalRef.hide();
    }
}
