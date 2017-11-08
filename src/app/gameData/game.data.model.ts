import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Player } from './player';
import { Week } from './week';

@Injectable()
export class GameDataModel {
  allPlayers$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>(null);
  week$: BehaviorSubject<Week> = new BehaviorSubject<Week>(null);

  setPlayers(players: Player[]) {
    console.log('set players');
    this.allPlayers$.next(players);
  }

  setWeek(week: Week) {
    console.log('set week');
    this.week$.next(week);
  }
}
