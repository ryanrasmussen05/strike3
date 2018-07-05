import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TieBreaker } from '../gameData/tie.breaker';
import { Strike3Game, Strike3Pick } from '../viewModel/strike3.game';

@Injectable()
export class ContextModel {
    contextTieBreaker$: BehaviorSubject<TieBreaker> = new BehaviorSubject<TieBreaker>(null);
    contextStrike3Game$: BehaviorSubject<Strike3Game> = new BehaviorSubject<Strike3Game>(null);
    contextStrike3Pick$: BehaviorSubject<Strike3Pick> = new BehaviorSubject<Strike3Pick>(null);

    setContextTieBreaker(tieBreaker: TieBreaker) {
        console.log('set context tie breaker');
        this.contextTieBreaker$.next(tieBreaker);
    }

    setContextStrike3Game(strike3Game: Strike3Game) {
        console.log('set context strike 3 game');
        this.contextStrike3Game$.next(strike3Game);
    }

    setContextStrike3Pick(strike3Pick: Strike3Pick) {
        console.log('set context strike 3 pick');
        this.contextStrike3Pick$.next(strike3Pick);
    }
}
