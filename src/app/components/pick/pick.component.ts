import { Component, Input, NgZone, OnInit } from '@angular/core';
import { PickModel } from '../../pick/pick.model';
import { UserModel } from '../../user/user.model';
import { Pick } from '../../pick/pick';
import { PickService } from '../../pick/pick.service';
import { Strike3Pick } from '../../viewModel/strike3.game';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit {
  @Input('admin') admin: boolean;
  @Input('strike3Pick') set strike3Pick(value: Strike3Pick) {
    if (value) {
      this.selectedTeam = value.team ? value.team : '';
      this.selectedStrike3Pick = value;
    }
  }

  selectedStrike3Pick: Strike3Pick;
  selectedTeam: string = '';
  error: boolean = false;
  loading: boolean = false;

  constructor(public zone: NgZone, public pickModel: PickModel, public userModel: UserModel, public pickService: PickService) {
  }

  ngOnInit() {
    $('#pick-modal').on('closed.zf.reveal', () => {
      this.zone.run(() => {
        this.selectedTeam = '';
        this.error = false;
        this.loading = false;
      });
    });
  }

  submitPick() {
    this.loading = true;
    this.error = false;

    const pick: Pick = {
      week: this.selectedStrike3Pick.week,
      uid: this.selectedStrike3Pick.uid,
      team: this.selectedTeam
    };

    this.pickService.submitPick(pick).then(() => {
      this.pickModel.addOrUpdatePick(pick,  this.admin);
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
