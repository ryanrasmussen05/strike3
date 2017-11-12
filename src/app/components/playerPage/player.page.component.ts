import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Strike3Game } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';

import 'rxjs/add/operator/merge';

@Component({
  templateUrl: './player.page.component.html'
})
export class PlayerPageComponent implements OnInit, OnDestroy {
  admin: boolean = false;
  strike3Game: Strike3Game;

  playerViewSubscription: Subscription;
  adminSubscription: Subscription;

  constructor(public playerViewModel: PlayerViewModel, public userModel: UserModel, public gameDataModel: GameDataModel) {
  }

  ngOnInit() {
    this.playerViewSubscription = this.playerViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });

    this.adminSubscription = this.userModel.currentUser$.merge(this.gameDataModel.allPlayers$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.admin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
    });

  }

  ngOnDestroy() {
    this.playerViewSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }
}
