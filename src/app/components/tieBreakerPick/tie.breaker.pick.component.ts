import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TieBreaker } from '../../models/tie.breaker';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { ContextTieBreakerSelector } from '../../reducers/context.reducer';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { GameData } from '../../models/game.data';
import { NFLGame } from '../../models/nfl.schedule';
import { Pick } from '../../models/pick';
import { UserSelector } from '../../reducers/user.reducer';
import { User } from '../../models/user';
import { ResetPickState, SubmitPick } from '../../actions/pick.actions';
import { PickState, PickStateSelector } from '../../reducers/pick.reducer';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-tie-breaker-pick',
    templateUrl: './tie.breaker.pick.component.html'
})
export class TieBreakerPickComponent implements OnInit, OnDestroy {
    gameData: GameData;
    user: User;

    tieBreaker: TieBreaker;
    isGameStarted: boolean = false;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;
    inProgress: boolean = false;

    contextSubscription: Subscription;
    gameDataSubscription: Subscription;
    userSubscription: Subscription;
    pickSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalRef: BsModalRef) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.gameData = gameData;
            this.isGameStarted = this._hasGameStarted();
        });

        this.contextSubscription = this.store.pipe(select(ContextTieBreakerSelector)).subscribe((tieBreaker: TieBreaker) => {
            this.tieBreaker = tieBreaker;
            this.isGameStarted = this._hasGameStarted();
        });

        this.userSubscription = this.store.pipe(select(UserSelector)).subscribe((user: User) => {
            this.user = user;
        });

        this.pickSubscription = this.store.pipe(select(PickStateSelector)).subscribe((pickState: PickState) => {
            this.loading = pickState.submitting;
            this.error = !!pickState.error;

            if (pickState.pickSubmitted && this.inProgress) {
                this.closeModal();
                this.store.dispatch(new ResetPickState());
            }
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
        this.gameDataSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
        this.store.dispatch(new ResetPickState());
    }

    private _hasGameStarted(): boolean {
        if (!this.gameData || ! this.tieBreaker) {
            return false;
        }

        const currentTime = new Date().getTime();

        const game: NFLGame = this.gameData.schedule.get(this.tieBreaker.week).find((nflGame: NFLGame) => {
            return this.tieBreaker.awayTeam === nflGame.awayTeam && this.tieBreaker.homeTeam === nflGame.homeTeam;
        });

        return currentTime > game.time;
    }

    submitTieBreaker() {
        this.inProgress = true;

        const pick: Pick = {
            week: this.tieBreaker.week,
            tieBreakerTeam: this.winningTeam,
            tieBreakerPoints: this.totalPoints
        };

        this.store.dispatch(new SubmitPick({pick: pick,  gameData: this.gameData, uid: this.user.uid}));
    }

    closeModal() {
        this.modalRef.hide();
    }
}
