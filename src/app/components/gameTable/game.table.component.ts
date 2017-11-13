import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { Week } from '../../gameData/week';

@Component({
  selector: 'app-game-table',
  templateUrl: './game.table.component.html',
  styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {
  @Input('admin') admin: boolean;

  @Input('strike3Game')
  set strike3Game(value: Strike3Game) {
    this.week = value.week.weekNumber;
    this.locked = value.week.locked;
    this.game = value;
    this.weekChange();
  }

  game: Strike3Game;

  week: number;
  locked: boolean;
  weekChanged: boolean = false;
  savingWeek: boolean = false;

  selectedPick: Strike3Pick;

  constructor(public gameDataService: GameDataService) {
  }

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

  weekChange() {
    this.weekChanged = (+this.week !== this.game.week.weekNumber || this.locked !== this.game.week.locked);
  }

  saveWeek() {
    const week: Week = {
      weekNumber: +this.week,
      locked: this.locked
    };

    this.savingWeek = true;

    this.gameDataService.setWeek(week).then(() => {
      this.savingWeek = false;
    }).catch((error) => {
      console.error(error);
      this.savingWeek = false;
    });
  }
}
