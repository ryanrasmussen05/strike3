import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { Subscription } from 'rxjs/Subscription';
import { PickModel } from '../../pick/pick.model';
import { PickService } from '../../pick/pick.service';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { Strike3Game } from '../../viewModel/strike3.game';
import { LoadingService } from '../../loading/loading.service';

import 'rxjs/add/operator/merge';

@Component({
  templateUrl: './admin.page.component.html'
})
export class AdminPageComponent implements OnInit, OnDestroy {
  admin: boolean = false;
  strike3Game: Strike3Game;

  playerSubscription: Subscription;
  adminViewSubscription: Subscription;

  constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public pickModel: PickModel,
              public pickService: PickService, public adminViewModel: AdminViewModel, public loadingService: LoadingService) {
  }

  ngOnInit() {
    this.adminViewSubscription = this.adminViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });

    this.playerSubscription = this.userModel.currentUser$.merge(this.gameDataModel.allPlayers$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.admin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);

      if (this.admin && this.pickModel.allPicksAdmin$.getValue() === null) {
        this.loadingService.loading();
        this.pickService.getAllPicks().then(() => {
          this.loadingService.done();
        }).catch((error) => {
          console.error(error);
          this.loadingService.done();
        });
      }
    });
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();
    this.adminViewSubscription.unsubscribe();
  }
}
