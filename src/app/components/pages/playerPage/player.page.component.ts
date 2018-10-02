import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from '../../../reducers';
import { select, Store } from '@ngrx/store';
import { PlayerViewModelSelector } from '../../../reducers/view.model.reducer';
import { Strike3Game } from '../../../models/strike3.game';
import { SetContextStrike3Game } from '../../../actions/context.actions';

@Component({
    templateUrl: './player.page.component.html'
})
export class PlayerPageComponent implements OnDestroy {
    playerViewSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.playerViewSubscription = this.store.pipe(select(PlayerViewModelSelector)).subscribe((strike3Game: Strike3Game) => {
            this.store.dispatch(new SetContextStrike3Game(strike3Game));
        });
    }

    ngOnDestroy() {
        this.playerViewSubscription.unsubscribe();
    }
}
