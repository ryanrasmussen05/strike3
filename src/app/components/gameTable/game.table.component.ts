import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';

@Component({
  selector: 'app-game-table',
  templateUrl: './game.table.component.html',
  styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {
  @Input('admin') admin: boolean;
  @Input('strike3Game') strike3Game: Strike3Game;

  selectedPick: Strike3Pick;

  ngOnInit() {
    $('#game-table').foundation();
  }

  ngOnDestroy() {
    const modalElement = $('#pick-modal');
    modalElement.foundation('_destroy');
    modalElement.remove();
  }

  openPickModal(strike3Pick: Strike3Pick) {
    if (strike3Pick.canEdit) {
      this.selectedPick = strike3Pick;
      $('#pick-modal').foundation('open');
    }
  }
}
