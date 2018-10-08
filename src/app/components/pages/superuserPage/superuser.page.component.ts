import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminPageComponent } from '../adminPage/admin.page.component';
import { NFLSchedule } from '../../../models/nfl.schedule';
import { AppState } from '../../../reducers';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GameDataState, GameDataStateSelector } from '../../../reducers/game.data.reducer';
import { GetSchedule, PostSchedule } from '../../../actions/game.data.actions';

@Component({
    templateUrl: './superuser.page.component.html',
    styleUrls: ['./superuser.page.component.scss']
})
export class SuperuserPageComponent extends AdminPageComponent implements OnInit, OnDestroy {
    schedule: NFLSchedule;

    gameDataSubscription: Subscription;

    constructor(public store: Store<AppState>) {
        super(store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.gameDataSubscription = this.store.pipe(select(GameDataStateSelector)).subscribe((gameDataState: GameDataState) => {
            this.schedule = gameDataState.schedule;

            if (this.schedule) {
                console.log(this.schedule);
            }
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.gameDataSubscription.unsubscribe();
    }

    fetchSchedule() {
        this.store.dispatch(new GetSchedule());
    }

    postSchedule() {
        this.store.dispatch(new PostSchedule(this.schedule));
    }
}
