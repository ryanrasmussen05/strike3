import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadingService } from '../loading/loading.service';
import { GameDataService } from '../gameData/game.data.service';

@Injectable()
export class GameDataResolver implements Resolve<boolean> {

  constructor(public gameDataService: GameDataService, public loadingService: LoadingService) {
  }

  resolve(): Promise<boolean> {
    console.log('resolving game data');

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
