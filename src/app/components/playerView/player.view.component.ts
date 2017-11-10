import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';

@Component({
  templateUrl: './player.view.component.html',
  styleUrls: ['./player.view.component.scss']
})
export class PlayerViewComponent implements OnInit, OnDestroy {
  strike3Game: Strike3Game;
  selectedWeek: number;
  playerViewSubscription: Subscription;

  constructor(public playerViewModel: PlayerViewModel) {
  }

  ngOnInit() {
    $('#player-view').foundation();

    this.playerViewSubscription = this.playerViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });
  }

  openPickModal(strike3Pick: Strike3Pick) {
    if (strike3Pick.canEdit) {
      this.selectedWeek = strike3Pick.week;
      $('#pick-modal').foundation('open');
    }
  }

  ngOnDestroy() {
    this.playerViewSubscription.unsubscribe();
  }
}
