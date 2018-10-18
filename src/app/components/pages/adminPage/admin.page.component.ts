import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AdminViewModelSelector } from '../../../reducers/view.model.reducer';
import { Strike3Game } from '../../../models/strike3.game';
import { SetContextStrike3Game } from '../../../actions/context.actions';
import { AppState } from '../../../reducers';
import { UserSelector } from '../../../reducers/user.reducer';
import { GameDataSelector } from '../../../reducers/game.data.reducer';
import { CanUserAccessAdmin, CanUserAccessSuperuser } from '../../../util/game.data.util';
import { UpdateResults } from '../../../actions/game.data.actions';
import { GameData } from '../../../models/game.data';

@Component({
    templateUrl: './admin.page.component.html',
    styleUrls: ['./admin.page.component.scss']
})
export class AdminPageComponent implements OnInit, OnDestroy {
    admin: boolean = false;
    superuser: boolean = false;
    gameData: GameData;

    playerSubscription: Subscription;
    adminViewSubscription: Subscription;

    constructor(public store: Store<AppState>) {
    }

    ngOnInit() {
        this.adminViewSubscription = this.store.pipe(select(AdminViewModelSelector)).subscribe((strike3Game: Strike3Game) => {
            this.store.dispatch(new SetContextStrike3Game(strike3Game));
        });

        this.playerSubscription = combineLatest(this.store.pipe(select(UserSelector)), this.store.pipe(select(GameDataSelector))).subscribe(([user, gameData]) => {
            if (gameData) {
                this.gameData = gameData;
                this.admin = CanUserAccessAdmin(gameData, user ? user.uid : null);
                this.superuser = CanUserAccessSuperuser(gameData, user ? user.uid : null);
            }
        });
    }

    ngOnDestroy() {
        this.adminViewSubscription.unsubscribe();
        this.playerSubscription.unsubscribe();
    }

    updateResults() {
        this.store.dispatch(new UpdateResults(this.gameData));
    }
}
