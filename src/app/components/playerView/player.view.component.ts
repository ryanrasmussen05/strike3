import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Strike3Game } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';

@Component({
  templateUrl: './player.view.component.html',
  styleUrls: ['./player.view.component.scss']
})
export class PlayerViewComponent implements OnInit, OnDestroy {
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
