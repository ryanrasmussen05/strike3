import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TieBreaker } from '../../models/tie.breaker';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { ContextTieBreakerSelector } from '../../reducers/context.reducer';
import * as clone from 'clone';
import { TieBreakerState, TieBreakerStateSelector } from '../../reducers/tie.breaker.reducer';
import { CreateTieBreaker, ResetTieBreaker } from '../../actions/tie.breaker.actions';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-tie-breaker-result',
    templateUrl: './tie.breaker.result.html'
})
export class TieBreakerResultComponent implements OnInit, OnDestroy {
    tieBreaker: TieBreaker;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;

    contextSubscription: Subscription;
    tieBreakerStateSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalRef: BsModalRef) {
    }

    ngOnInit() {
        this.contextSubscription = this.store.pipe(select(ContextTieBreakerSelector)).subscribe((tieBreaker: TieBreaker) => {
            this.tieBreaker = clone(tieBreaker);
        });

        this.tieBreakerStateSubscription = this.store.pipe(select(TieBreakerStateSelector)).subscribe((tieBreakerState: TieBreakerState) => {
            this.loading = tieBreakerState.submitting;
            this.error = !!tieBreakerState.error;

            if (tieBreakerState.submitted) {
                this.store.dispatch(new ResetTieBreaker());
                this.closeModal();
            }
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
        this.tieBreakerStateSubscription.unsubscribe();
    }

    submitResult() {
        this.tieBreaker.winningTeam = this.winningTeam;
        this.tieBreaker.points = this.totalPoints;

        this.store.dispatch(new CreateTieBreaker(this.tieBreaker));
    }

    closeModal() {
        this.modalRef.hide();
    }
}
