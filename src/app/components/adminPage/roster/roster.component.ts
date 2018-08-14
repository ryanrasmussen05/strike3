import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminViewModel } from '../../../viewModel/admin.view.model';
import { Strike3Player } from '../../../viewModel/strike3.game';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {
    players: Strike3Player[];

    adminViewSubscription: Subscription;

    constructor(public adminViewModel: AdminViewModel) {
    }

    ngOnInit() {
        this.adminViewSubscription = this.adminViewModel.strike3Game$.subscribe((game) => {

            if (game && game.players) {
                this.players = [...game.players];

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
