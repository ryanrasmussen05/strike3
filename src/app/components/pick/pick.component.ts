import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Strike3Pick } from '../../viewModel/strike3.game';
import { Pick, PickStatus } from '../../gameData/pick';
import { TeamModel } from '../../gameData/team.model';
import { GameDataService } from '../../gameData/game.data.service';

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
    }
  }

  selectedStrike3Pick: Strike3Pick;
  selectedTeam: string = '';
  pickStatus: PickStatus;

  error: boolean = false;
  loading: boolean = false;
  PickStatus = PickStatus;

  constructor(public zone: NgZone, public gameDataService: GameDataService, public teamModel: TeamModel) {
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

  submitPick() {
    this.loading = true;
    this.error = false;

    if (!this.pickStatus) this.pickStatus = PickStatus.Open;

    const pick: Pick = {
      week: this.selectedStrike3Pick.week,
      team: this.selectedTeam,
      status: this.pickStatus
    };

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
