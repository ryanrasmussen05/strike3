import { Component, Input, NgZone, OnInit } from '@angular/core';
import { PickModel } from '../../pick/pick.model';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html'
})
export class PickComponent implements OnInit {
  @Input('week') week: number;

  selectedTeam: string = '';
  error: string;
  loading: boolean = false;

  constructor(public zone: NgZone, public pickModel: PickModel) {
  }

  ngOnInit() {
    $('#pick-modal').on('closed.zf.reveal', () => {
      this.zone.run(() => {
        this.selectedTeam = '';
      });
    });
  }

  private _closeModal() {
    $('#pick-modal').foundation('close');
  }
}
