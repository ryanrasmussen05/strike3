import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { UserModel } from '../../user/user.model';

@Injectable()
export class AdminPageResolver implements Resolve<boolean> {

  constructor(public gameDataService: GameDataService, public loadingService: LoadingService) {
  }

  resolve(): Promise<boolean> {
    console.log('resolving admin view');

    this.loadingService.loading();

    return this.gameDataService.getGameData().then(() => {
      this.loadingService.done();
      return true;
    }).catch((error) => {
      this.loadingService.done();
      console.error(error);
      return false;
    });
  }
}
