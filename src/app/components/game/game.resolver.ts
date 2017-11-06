import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlayerModel } from '../../player/player.model';
import { PlayerService } from '../../player/player.service';
import { PickModel } from '../../pick/pick.model';
import { PickService } from '../../pick/pick.service';
import { LoadingService } from '../../loading/loading.service';

@Injectable()
export class GameResolver implements Resolve<boolean> {

  constructor(public playerModel: PlayerModel, public playerService: PlayerService, public pickModel: PickModel,
              public pickService: PickService, public loadingService: LoadingService) {
  }

  resolve(): Promise<boolean> {
    console.log('resolving home');
    const firstLoad: boolean = this.playerModel.allPlayers$.getValue() === null
      || this.pickModel.allPicks$.getValue() === null;

    const getPlayersPromise = this.playerService.getAllPlayers();
    const getPicksPromise = this.pickService.getAllPicks();

    if (!firstLoad) {
      return Promise.resolve(true);
    } else {
      this.loadingService.loading();
      return Promise.all([getPlayersPromise, getPicksPromise]).then(() => {
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
