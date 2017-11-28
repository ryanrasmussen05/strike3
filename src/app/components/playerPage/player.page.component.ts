import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Strike3Game } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';

import 'rxjs/add/operator/merge';

@Component({
  templateUrl: './player.page.component.html'
})
export class PlayerPageComponent implements OnInit, OnDestroy {
  strike3Game: Strike3Game;

  playerViewSubscription: Subscription;

  constructor(public playerViewModel: PlayerViewModel) {
  }

  ngOnInit() {
    this.playerViewSubscription = this.playerViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });
  }

  ngOnDestroy() {
    this.playerViewSubscription.unsubscribe();
  }
}
