import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PlayerModel } from '../../player/player.model';
import { PlayerService } from '../../player/player.service';

import 'rxjs/add/observable/of';

@Injectable()
export class HomeResolver implements Resolve<boolean> {

  constructor(public playerModel: PlayerModel, public playerService: PlayerService) {
  }

  resolve(): Observable<boolean> {
    console.log('resolving home');
    const firstLoad: boolean = this.playerModel.allPlayers$.getValue() === null;
    const getPlayersPromise = this.playerService.getAllPlayers();

    if (!firstLoad) {
      return Observable.of(true);
    } else {
      //TODO loading screen
      getPlayersPromise.then(() => {
        //TODO loading screen
        console.log(this.playerModel.allPlayers$.getValue());
        return true;
      }).catch((error) => {
        //TODO loading screen
        console.error(error);
        return false;
      });
    }
  }
}
