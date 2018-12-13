import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { ContextState, ContextStateSelector } from '../../reducers/context.reducer';
import { Strike3Pick } from '../../models/strike3.game';
import { PickStatus } from '../../models/pick';
import { TieBreaker } from '../../models/tie.breaker';
import { Team } from '../../models/team';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { GameData } from '../../models/game.data';
import { Pick } from '../../models/pick';
import { GetAvailableTeamsForPlayerAndWeek } from '../../util/game.data.util';
import { AllTeams, AllTeamsAdmin } from '../../util/teams.util';
import { ResetPickState, SubmitPick } from '../../actions/pick.actions';
import { PickState, PickStateSelector } from '../../reducers/pick.reducer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TieBreakerPickComponent } from '../tieBreakerPick/tie.breaker.pick.component';

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit, OnDestroy {
    admin: boolean;

    strike3Pick: Strike3Pick;
    selectedTeam: string = '';
    pickStatus: PickStatus;
    filteredTeams: Team[] = [];

    tieBreaker: TieBreaker;
    tieBreakerTeam: string;
    tieBreakerPoints: number;

    gameData: GameData;

    allTeams: Team[] = AllTeams;
    allTeamsAdmin: Team[] = AllTeamsAdmin;

    error: boolean = false;
    loading: boolean = false;
    PickStatus = PickStatus;

    contextSubscription: Subscription;
    gameDataSubscription: Subscription;
    pickSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalRef: BsModalRef, private modalService: BsModalService) {
    }

    ngOnInit() {
        this.contextSubscription = this.store.pipe(select(ContextStateSelector)).subscribe((contextState: ContextState) => {
            this.tieBreaker = contextState.contextTieBreaker;

            if (contextState.contextStrike3Pick) {
                this.selectedTeam = contextState.contextStrike3Pick.team ? contextState.contextStrike3Pick.team : '';
                this.tieBreakerTeam = contextState.contextStrike3Pick.tieBreakerTeam;
                this.tieBreakerPoints = contextState.contextStrike3Pick.tieBreakerPoints;
                this.pickStatus = contextState.contextStrike3Pick.status;
                this.strike3Pick = contextState.contextStrike3Pick;
                this.filterGamesForCurrentTime();
            }
        });

        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.gameData = gameData;
            this.filterGamesForCurrentTime();
        });

        this.pickSubscription = this.store.pipe(select(PickStateSelector)).subscribe((pickState: PickState) => {
            this.loading = pickState.submitting;
            this.error = !!pickState.error;

            if (pickState.pickSubmitted) {
                const shouldShowTieBreaker = !!this.tieBreaker && !this.strike3Pick.tieBreakerTeam && !this.admin;
                this.store.dispatch(new ResetPickState());
                this.closeModal();

                if (shouldShowTieBreaker) {
                    this._openTieBreaker();
                }
            }
        });
    }

    ngOnDestroy() {
        this.contextSubscription.unsubscribe();
        this.gameDataSubscription.unsubscribe();
        this.pickSubscription.unsubscribe();
        this.store.dispatch(new ResetPickState());
    }

    filterGamesForCurrentTime() {
        if (this.gameData && this.strike3Pick) {
            const availTeams = GetAvailableTeamsForPlayerAndWeek(this.gameData, this.strike3Pick.uid, this.strike3Pick.week);
            const filteredTeams = [];

            this.allTeams.forEach((currentTeam) => {
                const foundAvailableTeam = availTeams.find((currentAvailTeam) => {
                    return currentAvailTeam === currentTeam.abbreviation;
                });

                if (foundAvailableTeam) {
                    filteredTeams.push(currentTeam);
                }
            });

            this.filteredTeams = filteredTeams;
        }
    }

    submitPick() {
        if (!this.pickStatus) this.pickStatus = PickStatus.Open;

        const pick: Pick = {
            week: this.strike3Pick.week,
            team: this.selectedTeam,
            status: this.pickStatus,
        };

        if (this.tieBreakerTeam) pick.tieBreakerTeam = this.tieBreakerTeam;
        if (this.tieBreakerPoints) pick.tieBreakerPoints = this.tieBreakerPoints;

        if (this.selectedTeam !== this.strike3Pick.team) {
            pick.time = new Date().getTime();
        }

        this.store.dispatch(new SubmitPick({
            pick: pick,
            uid: this.strike3Pick.uid,
            gameData: this.gameData
        }));
    }

    closeModal() {
        this.modalRef.hide();
    }

    private _openTieBreaker() {
        this.modalService.show(TieBreakerPickComponent);
    }
}
