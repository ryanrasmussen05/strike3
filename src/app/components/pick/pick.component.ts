import { Component, Input, NgZone, OnInit } from '@angular/core';
import { PickModel } from '../../pick/pick.model';
import { UserModel } from '../../user/user.model';
import { Pick } from '../../pick/pick';
import { PickService } from '../../pick/pick.service';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit {
  @Input('week') week: number;

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
    const currentUser = this.userModel.currentUser$.getValue();
    if (!currentUser || !this.selectedTeam) return;

    this.loading = true;
    this.error = false;

    const newPick: Pick = {
      uid: currentUser.uid,
      week: this.week,
      team: this.selectedTeam
    };

    this.pickService.submitPick(newPick).then(() => {
      this.pickModel.addPick(newPick);
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
