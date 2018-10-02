import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TieBreaker } from '../../models/tie.breaker';
import { PickStatus } from '../../models/pick';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { UserSelector } from '../../reducers/user.reducer';
import { Strike3Game, Strike3Pick, Strike3Player } from '../../models/strike3.game';
import { ContextStrike3GameSelector } from '../../reducers/context.reducer';
import { SetContextStrike3Pick, SetContextTieBreaker } from '../../actions/context.actions';
import { User } from '../../models/user';
import * as clone from 'clone';
import { GameDataState, GameDataStateSelector } from '../../reducers/game.data.reducer';
import { Week } from '../../models/week';
import { UpdateWeek } from '../../actions/game.data.actions';
import { BsModalService } from 'ngx-bootstrap';
import { PickComponent } from '../pick/pick.component';
import { TieBreakerPickComponent } from '../tieBreakerPick/tie.breaker.pick.component';
import { ViewTieBreakersComponent } from '../viewTieBreakers/view.tie.breakers.component';

@Component({
    selector: 'app-game-table',
    templateUrl: './game.table.component.html',
    styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {
    @Input('admin') admin: boolean;

    // strictly for attaching non-admin view game table to emails
    @Input('overrideContextGame') overrideContextGame: Strike3Game;

    strike3Game: Strike3Game;

    user: User;

    weekNumber: number;
    isWeekPublic: boolean;
    weekChanged: boolean = false;

    tieBreaker: TieBreaker = null;
    tieBreakerPick: Strike3Pick = null;
    previousTieBreakers: boolean = false; // show tie breaker button if needed for history

    savingWeek: boolean = false;

    pickStatus = PickStatus;

    contextSubscription: Subscription;
    userSubscription: Subscription;
    gameDataSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalService: BsModalService) {
    }

    ngOnInit(): void {
        this.userSubscription = this.store.pipe(select(UserSelector)).subscribe((currentUser: User) => {
            this.user = currentUser;
            this._setTieBreakerPick();
        });

        this.contextSubscription = this.store.pipe(select(ContextStrike3GameSelector)).subscribe((strike3Game: Strike3Game) => {
            this.strike3Game = this.overrideContextGame ? this.overrideContextGame : strike3Game;
            this.weekNumber = this.strike3Game.week.weekNumber;
            this.isWeekPublic = this.strike3Game.week.public;
            this.weekChange();
            this._setTieBreaker();
            this._setTieBreakerPick();
            this._setPreviousTieBreakers();
        });

        this.gameDataSubscription = this.store.pipe(select(GameDataStateSelector)).subscribe((gameDataState: GameDataState) => {
            this.savingWeek = gameDataState.loading;
        });
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
        this.contextSubscription.unsubscribe();
        this.gameDataSubscription.unsubscribe();
    }

    openPickModal(strike3Pick: Strike3Pick) {
        if (strike3Pick.canEdit) {
            this.store.dispatch(new SetContextTieBreaker(this._getTieBreakerForWeek(strike3Pick.week)));
            this.store.dispatch(new SetContextStrike3Pick(clone(strike3Pick)));
            this.modalService.show(PickComponent, {initialState: {admin: this.admin}});
        }
    }

    openTieBreakerModal() {
        this.store.dispatch(new SetContextTieBreaker(this.tieBreaker));
        this.modalService.show(TieBreakerPickComponent);
    }

    openTieBreakersModal() {
        this.modalService.show(ViewTieBreakersComponent, {initialState: {admin: this.admin}});
    }

    weekNumberChange() {
        this.isWeekPublic = false;
        this.weekChange();
    }

    weekChange() {
        this.weekChanged = (+this.weekNumber !== this.strike3Game.week.weekNumber || this.isWeekPublic !== this.strike3Game.week.public);
    }

    saveWeek() {
        const week: Week = {
            weekNumber: +this.weekNumber,
            public: this.isWeekPublic
        };

        this.store.dispatch(new UpdateWeek(week));
    }

    private _getTieBreakerForWeek(week: number) {
        if (this.strike3Game.tieBreakers && this.strike3Game.tieBreakers.get(week)) {
            return this.strike3Game.tieBreakers.get(week);
        } else {
            return null;
        }
    }

    private _setTieBreaker() {
        if (this.strike3Game.tieBreakers && this.strike3Game.tieBreakers.get(this.strike3Game.week.weekNumber)) {
            this.tieBreaker = this.strike3Game.tieBreakers.get(this.strike3Game.week.weekNumber);
        } else {
            this.tieBreaker = null;
        }
    }

    private _setTieBreakerPick() {
        this.tieBreakerPick = null;

        if (this.strike3Game && this.user) {
            const s3Player: Strike3Player = this.strike3Game.players.find((player: Strike3Player) => {
                return player.uid === this.user.uid;
            });

            if (s3Player) {
                const s3Pick: Strike3Pick = s3Player.picks.find((pick: Strike3Pick) => {
                    return this.weekNumber === pick.week;
                });

                if (s3Pick) {
                    this.tieBreakerPick = s3Pick;
                }
            }
        }
    }

    // handle rare case that there is no tie breaker for current week, but have been previous tie breaker
    private _setPreviousTieBreakers() {
        this.previousTieBreakers = this.strike3Game.tieBreakers && this.strike3Game.tieBreakers.size > 0;
    }
}
