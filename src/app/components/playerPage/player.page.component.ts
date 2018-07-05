import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Strike3Game } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';
import { ContextModel } from '../context.model';

@Component({
    templateUrl: './player.page.component.html'
})
export class PlayerPageComponent implements OnInit, OnDestroy {
    playerViewSubscription: Subscription;

    constructor(public playerViewModel: PlayerViewModel, public contextModel: ContextModel) {
    }

    ngOnInit() {
        this.playerViewSubscription = this.playerViewModel.strike3Game$.subscribe((game) => {
            this.contextModel.setContextStrike3Game(game);
        });
    }

    ngOnDestroy() {
        this.playerViewSubscription.unsubscribe();
    }
}
