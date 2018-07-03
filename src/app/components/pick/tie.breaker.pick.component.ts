import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TeamModel } from '../../gameData/team.model';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { TieBreaker } from '../../gameData/tie.breaker';
import { GameData } from '../../gameData/game.data';
import { NFLGame } from '../../gameData/nfl.schedule';
import { Pick } from '../../gameData/pick';
import { UserModel } from '../../user/user.model';
import { ContextModel } from '../context.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tie-breaker-pick',
    templateUrl: './tie.breaker.pick.component.html'
})
export class TieBreakerPickComponent implements OnInit, OnDestroy {

    selectedTieBreaker: TieBreaker;
    isGameStarted: boolean = false;
    winningTeam: string = '';
    totalPoints: number;

    error: boolean = false;
    loading: boolean = false;

    contextSubscription: Subscription;

    constructor(public zone: NgZone, public gameDataService: GameDataService, public teamModel: TeamModel,
                public gameDataModel: GameDataModel, public userModel: UserModel, public contextModel: ContextModel) {
    }

    ngOnInit() {
        $('#tie-breaker-pick-modal').on('closed.zf.reveal', () => {
            this.zone.run(() => {
                this.winningTeam = '';
                this.totalPoints = null;
                this.error = false;
                this.loading = false;
            });
        });

        this.contextSubscription = this.contextModel.contextTieBreaker$.subscribe((tieBreaker: TieBreaker) => {
            if (tieBreaker) {
                this.selectedTieBreaker = tieBreaker;
                this.isGameStarted = this._hasGameStarted();
            }
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
    }

    private _hasGameStarted(): boolean {
        const gameData: GameData = this.gameDataModel.gameData$.getValue();
        const currentTime = new Date().getTime();

        const game: NFLGame = gameData.schedule.get(this.selectedTieBreaker.week).find((nflGame: NFLGame) => {
            return this.selectedTieBreaker.awayTeam === nflGame.awayTeam
                && this.selectedTieBreaker.homeTeam === nflGame.homeTeam;
        });

        return currentTime > game.time;
    }

    submitTieBreaker() {
        this.loading = true;
        this.error = false;

        const pick: Pick = {
            week: this.selectedTieBreaker.week,
            tieBreakerTeam: this.winningTeam,
            tieBreakerPoints: this.totalPoints
        };

        this.gameDataService.submitPick(pick, this.userModel.currentUser$.getValue().uid).then(() => {
            this.loading = false;
            this.closeModal();
        }).catch((error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    closeModal() {
        $('#tie-breaker-pick-modal').foundation('close');
    }
}
