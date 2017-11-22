import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { Subscription } from 'rxjs/Subscription';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { Strike3Game } from '../../viewModel/strike3.game';

import 'rxjs/add/operator/merge';

@Component({
  templateUrl: './admin.page.component.html'
})
export class AdminPageComponent implements OnInit, OnDestroy {
  admin: boolean = false;
  superuser: boolean = false;
  strike3Game: Strike3Game;

  playerSubscription: Subscription;
  adminViewSubscription: Subscription;

  constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public adminViewModel: AdminViewModel) {
  }

  ngOnInit() {
    this.adminViewSubscription = this.adminViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });

    this.playerSubscription = this.userModel.currentUser$.merge(this.gameDataModel.gameData$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.admin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
      this.superuser = this.gameDataModel.canAccessSuperuser(currentUser ? currentUser.uid : null);
    });
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();
    this.adminViewSubscription.unsubscribe();
  }
}
