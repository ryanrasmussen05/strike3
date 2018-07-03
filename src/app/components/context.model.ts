import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TieBreaker } from '../gameData/tie.breaker';

@Injectable()
export class ContextModel {
    contextTieBreaker$: BehaviorSubject<TieBreaker> = new BehaviorSubject<TieBreaker>(null);

    setContextTieBreaker(tieBreaker: TieBreaker) {
        console.log('set context tie breaker');
        this.contextTieBreaker$.next(tieBreaker);
    }
}
