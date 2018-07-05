import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Strike3Pick } from '../../viewModel/strike3.game';
import { Pick, PickStatus } from '../../gameData/pick';
import { TeamModel } from '../../gameData/team.model';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { Team } from '../../gameData/team';
import { TieBreaker } from '../../gameData/tie.breaker';
import { Subscription } from 'rxjs';
import { ContextModel } from '../context.model';

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit, OnDestroy {
    @Input('admin') admin: boolean;

    selectedStrike3Pick: Strike3Pick;
    selectedTeam: string = '';
    pickStatus: PickStatus;
    filteredTeams: Team[] = [];

    tieBreaker: TieBreaker;
    tieBreakerTeam: string;
    tieBreakerPoints: number;

    error: boolean = false;
    loading: boolean = false;
    PickStatus = PickStatus;

    contextTieBreakerSubscription: Subscription;
    contextStrike3PickSubscription: Subscription;

    constructor(public zone: NgZone, public gameDataService: GameDataService, public teamModel: TeamModel,
                public gameDataModel: GameDataModel, public contextModel: ContextModel) {
    }

    ngOnInit() {
        $('#pick-modal').on('closed.zf.reveal', () => {
            this.zone.run(() => {
                this.selectedTeam = '';
                this.pickStatus = null;
                this.error = false;
                this.loading = false;
            });
        });

        this.contextTieBreakerSubscription = this.contextModel.contextTieBreaker$.subscribe((tieBreaker: TieBreaker) => {
            this.tieBreaker = tieBreaker;
        });

        this.contextStrike3PickSubscription = this.contextModel.contextStrike3Pick$.subscribe((strike3Pick: Strike3Pick) => {
            if (strike3Pick) {
                this.selectedTeam = strike3Pick.team ? strike3Pick.team : '';
                this.tieBreakerTeam = strike3Pick.tieBreakerTeam;
                this.tieBreakerPoints = strike3Pick.tieBreakerPoints;
                this.pickStatus = strike3Pick.status;
                this.selectedStrike3Pick = strike3Pick;
                this.filterGamesForCurrentTime();
            }
        });
    }

    ngOnDestroy() {
        this.contextTieBreakerSubscription.unsubscribe();
        $('#pick-modal').off('closed.zf.reveal');
    }

    filterGamesForCurrentTime() {
        const availTeams = this.gameDataModel.getAvailableTeamsForPlayerAndWeek(this.selectedStrike3Pick.uid, this.selectedStrike3Pick.week);
        const filteredTeams = [];

        this.teamModel.allTeams.forEach((currentTeam) => {
            const foundAvailableTeam = availTeams.find((currentAvailTeam) => {
                return currentAvailTeam === currentTeam.abbreviation;
            });

            if (foundAvailableTeam) {
                filteredTeams.push(currentTeam);
            }
        });

        this.filteredTeams = filteredTeams;
    }

    submitPick() {
        this.loading = true;
        this.error = false;

        if (!this.pickStatus) this.pickStatus = PickStatus.Open;

        const pick: Pick = {
            week: this.selectedStrike3Pick.week,
            team: this.selectedTeam,
            status: this.pickStatus,
        };

        if (this.tieBreakerTeam) pick.tieBreakerTeam = this.tieBreakerTeam;
        if (this.tieBreakerPoints) pick.tieBreakerPoints = this.tieBreakerPoints;

        if (this.selectedTeam !== this.selectedStrike3Pick.team) {
            pick.time = new Date().getTime();
        }

        this.gameDataService.submitPick(pick, this.selectedStrike3Pick.uid).then(() => {
            this.loading = false;

            const shouldShowTieBreaker = !!this.tieBreaker && !this.selectedStrike3Pick.tieBreakerTeam && !this.admin;
            this._closeModal();

            if (shouldShowTieBreaker) {
                this._openTieBreaker();
            }
        }).catch((error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    private _closeModal() {
        $('#pick-modal').foundation('close');
    }

    private _openTieBreaker() {
        $('#tie-breaker-pick-modal').foundation('open');
    }
}
