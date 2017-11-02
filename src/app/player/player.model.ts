import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Player } from './player';

@Injectable()
export class PlayerModel {
  allPlayers$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);

  setPlayers(players: Player[]) {
    this.allPlayers$.next(players);
  }
}
