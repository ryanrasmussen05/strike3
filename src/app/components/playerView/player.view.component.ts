import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';
import { PlayerViewModel } from '../../viewModel/player.view.model';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';

@Component({
  templateUrl: './player.view.component.html',
  styleUrls: ['./player.view.component.scss']
})
export class PlayerViewComponent implements OnInit, OnDestroy {
  admin: boolean = false;
  strike3Game: Strike3Game;
  selectedWeek: number;

  playerViewSubscription: Subscription;
  adminSubscription: Subscription;

  constructor(public playerViewModel: PlayerViewModel, public userModel: UserModel, public gameDataModel: GameDataModel) {
  }

  ngOnInit() {
    $('#player-view').foundation();

    this.playerViewSubscription = this.playerViewModel.strike3Game$.subscribe((game) => {
      this.strike3Game = game;
    });

    this.adminSubscription = this.userModel.currentUser$.merge(this.gameDataModel.allPlayers$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.admin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
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
    this.adminSubscription.unsubscribe();
  }
}
