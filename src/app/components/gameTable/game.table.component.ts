import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { Week } from '../../gameData/week';
import { PickStatus } from '../../gameData/pick';

@Component({
  selector: 'app-game-table',
  templateUrl: './game.table.component.html',
  styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {
  @Input('admin') admin: boolean;

  @Input('strike3Game')
  set strike3Game(value: Strike3Game) {
    this.weekNumber = value.week.weekNumber;
    this.isWeekPublic = value.week.public;
    this.game = value;
    this.weekChange();
  }

  game: Strike3Game;

  weekNumber: number;
  isWeekPublic: boolean;
  weekChanged: boolean = false;
  savingWeek: boolean = false;

  selectedPick: Strike3Pick;

  pickStatus = PickStatus;

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
      this.selectedPick = Object.create(strike3Pick);
      $('#pick-modal').foundation('open');
    }
  }

  weekChange() {
    this.weekChanged = (+this.weekNumber !== this.game.week.weekNumber || this.isWeekPublic !== this.game.week.public);
  }

  saveWeek() {
    const week: Week = {
      weekNumber: +this.weekNumber,
      public: this.isWeekPublic
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
