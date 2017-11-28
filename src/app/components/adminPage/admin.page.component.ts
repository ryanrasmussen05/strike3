import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { Subscription } from 'rxjs/Subscription';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { Strike3Game } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { LoadingService } from '../../loading/loading.service';

import 'rxjs/add/operator/merge';

declare const html2canvas: any;

@Component({
  templateUrl: './admin.page.component.html'
})
export class AdminPageComponent implements OnInit, OnDestroy, AfterViewInit {
  admin: boolean = false;
  superuser: boolean = false;
  strike3Game: Strike3Game;

  playerSubscription: Subscription;
  adminViewSubscription: Subscription;

  constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public gameDataService: GameDataService,
              public adminViewModel: AdminViewModel, public loadingService: LoadingService) {
  }

  ngAfterViewInit() {
    $('#admin-view').foundation();
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

  updateResults() {
    this.loadingService.loading();

    this.gameDataService.updateResults().then(() => {
      this.loadingService.done();
    }).catch((error) => {
      console.error(error);
      this.loadingService.done();
    });
  }

  screenshot(linkElement: HTMLAnchorElement) {
    html2canvas($('#game-table-results'), {
      background: '#ffffff',
      width: 1050,
      onrendered: function(canvas) {
        linkElement.href = canvas.toDataURL('image/png');
        linkElement.click();
      }
    });
  }
}
