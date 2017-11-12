import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/merge';

@Component({
  templateUrl: './admin.view.component.html'
})
export class AdminViewComponent implements OnInit, OnDestroy {

  isAdmin: boolean = false;
  playerSubscription: Subscription;

  constructor(public userModel: UserModel, public gameDataModel: GameDataModel) {
  }

  ngOnInit() {
    this.playerSubscription = this.userModel.currentUser$.merge(this.gameDataModel.allPlayers$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.isAdmin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
    });
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();
  }
}
