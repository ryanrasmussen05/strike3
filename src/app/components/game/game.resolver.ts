import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlayerModel } from '../../player/player.model';
import { PlayerService } from '../../player/player.service';
import { PickModel } from '../../pick/pick.model';
import { PickService } from '../../pick/pick.service';

@Injectable()
export class GameResolver implements Resolve<boolean> {

  constructor(public playerModel: PlayerModel, public playerService: PlayerService, public pickModel: PickModel,
              public pickService: PickService) {
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
      //TODO loading screen
      return Promise.all([getPlayersPromise, getPicksPromise]).then(() => {
        //TODO loading screen
        return true;
      }).catch((error) => {
        //TODO loading screen
        console.error(error);
        return false;
      });
    }
  }
}
