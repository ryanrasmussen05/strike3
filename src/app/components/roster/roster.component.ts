import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Strike3Game, Strike3Player } from '../../models/strike3.game';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { AdminViewModelSelector } from '../../reducers/view.model.reducer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {
    players: Strike3Player[];

    adminViewSubscription: Subscription;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.adminViewSubscription = this.store.pipe(select(AdminViewModelSelector)).subscribe((strike3Game: Strike3Game) => {
            if (strike3Game && strike3Game.players) {
                this.players = [...strike3Game.players];

                this.players.sort((a, b): number => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
            }
        });
    }

    ngOnDestroy() {
        this.adminViewSubscription.unsubscribe();
    }

}
