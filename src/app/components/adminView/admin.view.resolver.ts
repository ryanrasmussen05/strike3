import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';

@Injectable()
export class AdminViewResolver implements Resolve<boolean> {

  constructor(public gameDataService: GameDataService, public gameDataModel: GameDataModel, public loadingService: LoadingService) {
  }

  resolve(): Promise<boolean> {
    console.log('resolving admin view');
    const firstLoad: boolean = this.gameDataModel.allPlayers$.getValue() === null
      || this.gameDataModel.week$.getValue() === null;

    const resolvePromise = this.gameDataService.getGameData();

    if (!firstLoad) {
      return Promise.resolve(true);
    } else {
      this.loadingService.loading();
      return resolvePromise.then(() => {
        this.loadingService.done();
        return true;
      }).catch((error) => {
        this.loadingService.done();
        console.error(error);
        return false;
      });
    }
  }
}
