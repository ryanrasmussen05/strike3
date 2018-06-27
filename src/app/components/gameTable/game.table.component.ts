import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick, Strike3Player } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { Week } from '../../gameData/week';
import { PickStatus } from '../../gameData/pick';
import { TieBreaker } from '../../gameData/tie.breaker';
import { UserModel } from '../../user/user.model';
import { Subscription } from 'rxjs';

import * as firebase from 'firebase';

@Component({
    selector: 'app-game-table',
    templateUrl: './game.table.component.html',
    styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input('admin') admin: boolean;

    @Input('strike3Game')
    set strike3Game(value: Strike3Game) {
        this.weekNumber = value.week.weekNumber;
        this.isWeekPublic = value.week.public;
        this.game = value;
        this.weekChange();
        this._setTieBreaker();
        this._setTieBreakerPick();
    }

    game: Strike3Game;

    user: firebase.User;
    userSubscription: Subscription;

    weekNumber: number;
    isWeekPublic: boolean;
    weekChanged: boolean = false;

    tieBreaker: TieBreaker = null;
    tieBreakerPick: Strike3Pick = null;

    selectedPick: Strike3Pick;

    savingWeek: boolean = false;

    pickStatus = PickStatus;

    constructor(public gameDataService: GameDataService, public userModel: UserModel) {
    }

    ngOnInit(): void {
        this.userSubscription = this.userModel.currentUser$.subscribe(() => {
            this.user = this.userModel.currentUser$.getValue();
            this._setTieBreakerPick();
        });
    }

    ngAfterViewInit() {
        $('#game-table').foundation();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();

        const modalElement = $('#pick-modal');
        modalElement.foundation('_destroy');
        modalElement.remove();
    }

    openPickModal(strike3Pick: Strike3Pick) {
        if (strike3Pick.canEdit) {
            this.selectedPick = Object.create(strike3Pick);
            $('#pick-modal').foundation('open');
        }
    }

    openTieBreakerModal() {
        $('#tie-breaker-pick-modal').foundation('open');
    }

    weekChange() {
        this.weekChanged = (+this.weekNumber !== this.game.week.weekNumber || this.isWeekPublic !== this.game.week.public);
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

    private _setTieBreaker() {
        if (this.game.tieBreakers && this.game.tieBreakers.get(this.game.week.weekNumber)) {
            this.tieBreaker = this.game.tieBreakers.get(this.game.week.weekNumber);
        } else {
            this.tieBreaker = null;
        }
    }

    private _setTieBreakerPick() {
        this.tieBreakerPick = null;

        if (this.game && this.user) {
            const s3Player: Strike3Player = this.game.players.find((player: Strike3Player) => {
                return player.uid === this.user.uid;
            });

            if (s3Player) {
                const s3Pick: Strike3Pick = s3Player.picks.find((pick: Strike3Pick) => {
                    return this.weekNumber === pick.week;
                });

                if (s3Pick && s3Pick.tieBreakerTeam) {
                    this.tieBreakerPick = s3Pick;
                }
            }
        }
    }
}
