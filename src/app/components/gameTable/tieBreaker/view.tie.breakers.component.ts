import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick } from '../../../viewModel/strike3.game';
import { TieBreaker } from '../../../gameData/tie.breaker';
import { ContextModel } from '../../context.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-view-tie-breakers',
    templateUrl: './view.tie.breakers.component.html',
    styleUrls: ['./view.tie.breakers.component.scss']
})
export class ViewTieBreakersComponent implements OnInit, OnDestroy {
    currentStrike3Game: Strike3Game;

    tieBreakers: TieBreaker[] = [];
    selectedTieBreaker: TieBreaker;

    picksForWeek: Strike3Pick[] = [];

    contextSubscription: Subscription;

    constructor(public contextModel: ContextModel){
    }

    ngOnInit() {
        this.contextSubscription = this.contextModel.contextStrike3Game$.subscribe((strike3Game: Strike3Game) => {
            this.currentStrike3Game = strike3Game;
            this._setup();
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
    }

    tieBreakerChange() {
        this._buildModelForWeek();
    }

    private _setup() {
        this.tieBreakers = Array.from(this.currentStrike3Game.tieBreakers.values());
        this._sortTieBreakers(this.tieBreakers);

        this.selectedTieBreaker = this.tieBreakers[this.tieBreakers.length - 1];
        this._buildModelForWeek();
    }

    private _buildModelForWeek() {
        const picksForWeek: Strike3Pick[] = [];

        if (!this.selectedTieBreaker) {
            this.picksForWeek = picksForWeek;
            return;
        }

        this.currentStrike3Game.players.forEach((currentPlayer) => {
            const playerPick = currentPlayer.picks.find((strike3Pick) => {
                return strike3Pick.week === this.selectedTieBreaker.week;
            });

            if (playerPick && playerPick.tieBreakerTeam) {
                picksForWeek.push(playerPick);
            }
        });

        this._sortPicks(picksForWeek);
        this.picksForWeek = picksForWeek;
    }

    private _sortTieBreakers(tieBreakers: TieBreaker[]) {
        tieBreakers.sort((a, b) => {
            return a.week - b.week;
        });
    }

    private _sortPicks(picks: Strike3Pick[]) {
        if (this.selectedTieBreaker.winningTeam) {
            picks.sort((a, b) => {
                if ((a.tieBreakerTeam === this.selectedTieBreaker.winningTeam) && (b.tieBreakerTeam !== this.selectedTieBreaker.winningTeam)) return -1;
                if ((a.tieBreakerTeam !== this.selectedTieBreaker.winningTeam) && (b.tieBreakerTeam === this.selectedTieBreaker.winningTeam)) return 1;
                if ((a.tieBreakerPoints <= this.selectedTieBreaker.points) && (b.tieBreakerPoints > this.selectedTieBreaker.points)) return -1;
                if ((a.tieBreakerPoints > this.selectedTieBreaker.points) && (b.tieBreakerPoints <= this.selectedTieBreaker.points)) return 1;
                if ((a.tieBreakerPoints <= this.selectedTieBreaker.points) && (b.tieBreakerPoints <= this.selectedTieBreaker.points)) return (b.tieBreakerPoints - a.tieBreakerPoints);
                if ((a.tieBreakerPoints > this.selectedTieBreaker.points) && (b.tieBreakerPoints > this.selectedTieBreaker.points)) return (a.tieBreakerPoints - b.tieBreakerPoints);
                return 0;
            });
        }
    }
}
