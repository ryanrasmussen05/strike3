import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Strike3Pick } from '../../viewModel/strike3.game';
import { Pick, PickStatus } from '../../gameData/pick';
import { TeamModel } from '../../gameData/team.model';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { Team } from '../../gameData/team';

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit {
    @Input('admin') admin: boolean;

    @Input('strike3Pick') set strike3Pick(value: Strike3Pick) {
        if (value) {
            this.selectedTeam = value.team ? value.team : '';
            this.pickStatus = value.status;
            this.selectedStrike3Pick = value;
            this.filterGamesForCurrentTime();
        }
    }

    selectedStrike3Pick: Strike3Pick;
    selectedTeam: string = '';
    pickStatus: PickStatus;
    filteredTeams: Team[] = [];

    error: boolean = false;
    loading: boolean = false;
    PickStatus = PickStatus;

    constructor(public zone: NgZone, public gameDataService: GameDataService, public teamModel: TeamModel,
                public gameDataModel: GameDataModel) {
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
            status: this.pickStatus
        };

        if (this.selectedTeam !== this.selectedStrike3Pick.team) {
            pick.time = new Date().getTime();
        }

        this.gameDataService.submitPick(pick, this.selectedStrike3Pick.uid).then(() => {
            this.loading = false;
            this._closeModal();
        }).catch((error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    private _closeModal() {
        $('#pick-modal').foundation('close');
    }
}
