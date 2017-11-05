import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Player } from './player';

@Injectable()
export class PlayerModel {
  allPlayers$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>(null);

  setPlayers(players: Player[]) {
    console.log('set players');
    this.allPlayers$.next(players);
  }
}
