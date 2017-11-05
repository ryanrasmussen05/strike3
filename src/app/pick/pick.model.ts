import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Pick } from './pick';

@Injectable()
export class PickModel {
  allPicks$: BehaviorSubject<Pick[]> = new BehaviorSubject<Pick[]>(null);

  setPicks(picks: Pick[]) {
    console.log('set picks');
    this.allPicks$.next(picks);
  }
}
