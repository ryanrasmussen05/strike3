import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick, Strike3Player } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { Week } from '../../gameData/week';
import { PickStatus } from '../../gameData/pick';
import { TieBreaker } from '../../gameData/tie.breaker';
import { UserModel } from '../../user/user.model';
import { Subscription } from 'rxjs';
import { ContextModel } from '../context.model';

import * as firebase from 'firebase';

@Component({
    selector: 'app-game-table',
    templateUrl: './game.table.component.html',
    styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input('admin') admin: boolean;

    strike3Game: Strike3Game;

    user: firebase.User;
    userSubscription: Subscription;

    weekNumber: number;
    isWeekPublic: boolean;
    weekChanged: boolean = false;

    tieBreaker: TieBreaker = null;
    tieBreakerPick: Strike3Pick = null;
    previousTieBreakers: boolean = false; //show tie breaker button if needed for history

    savingWeek: boolean = false;

    pickStatus = PickStatus;

    contextSubscription: Subscription;

    constructor(public gameDataService: GameDataService, public userModel: UserModel, public contextModel: ContextModel) {
    }

    ngOnInit(): void {
        this.userSubscription = this.userModel.currentUser$.subscribe(() => {
            this.user = this.userModel.currentUser$.getValue();
            this._setTieBreakerPick();
        });

        this.contextSubscription = this.contextModel.contextStrike3Game$.subscribe((strike3Game: Strike3Game) => {
            this.weekNumber = strike3Game.week.weekNumber;
            this.isWeekPublic = strike3Game.week.public;
            this.strike3Game = strike3Game;
            this.weekChange();
            this._setTieBreaker();
            this._setTieBreakerPick();
            this._setPreviousTieBreakers();
        });
    }

    ngAfterViewInit() {
        $('#game-table').foundation();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();

        const pickModalElement = $('#pick-modal');
        pickModalElement.foundation('_destroy');
        pickModalElement.remove();

        const tieBreakerPickModal = $('#tie-breaker-pick-modal');
        tieBreakerPickModal.foundation('_destroy');
        tieBreakerPickModal.remove();

        const tieBreakersModal = $('#tie-breakers-modal');
        tieBreakersModal.foundation('_destroy');
        tieBreakersModal.remove();
    }

    openPickModal(strike3Pick: Strike3Pick) {
        if (strike3Pick.canEdit) {
            this.contextModel.setContextTieBreaker(this._getTieBreakerForWeek(strike3Pick.week));
            this.contextModel.setContextStrike3Pick(Object.create(strike3Pick));
            $('#pick-modal').foundation('open');
        }
    }

    openTieBreakerModal() {
        this.contextModel.setContextTieBreaker(this.tieBreaker);
        $('#tie-breaker-pick-modal').foundation('open');
    }

    openTieBreakersModal() {
        $('#tie-breakers-modal').foundation('open');
    }

    weekChange() {
        this.weekChanged = (+this.weekNumber !== this.strike3Game.week.weekNumber || this.isWeekPublic !== this.strike3Game.week.public);
    }

    saveWeek() {
        const week: Week = {
            weekNumber: +this.weekNumber,
            public: this.isWeekPublic
        };

        this.savingWeek = true;

        this.gameDataService.setWeek(week).then(() => {
            this.savingWeek = false;
        }).catch((error) => {
            console.error(error);
            this.savingWeek = false;
        });
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

    //handle rare case that there is no tie breaker for current week, but have been previous tie breaker
    private _setPreviousTieBreakers() {
        this.previousTieBreakers = this.strike3Game.tieBreakers && this.strike3Game.tieBreakers.size > 0;
    }
}
