import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Strike3Game, Strike3Pick } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { Week } from '../../gameData/week';
import { PickStatus } from '../../gameData/pick';
import { TieBreaker } from '../../gameData/tie.breaker';

@Component({
    selector: 'app-game-table',
    templateUrl: './game.table.component.html',
    styleUrls: ['./game.table.component.scss']
})
export class GameTableComponent implements AfterViewInit, OnDestroy {
    @Input('admin') admin: boolean;

    @Input('strike3Game')
    set strike3Game(value: Strike3Game) {
        this.weekNumber = value.week.weekNumber;
        this.isWeekPublic = value.week.public;
        this.game = value;
        this.weekChange();
        this._setTieBreaker();
    }

    game: Strike3Game;

    weekNumber: number;
    isWeekPublic: boolean;
    weekChanged: boolean = false;

    tieBreaker: TieBreaker = null;

    selectedPick: Strike3Pick;

    savingWeek: boolean = false;

    pickStatus = PickStatus;

    constructor(public gameDataService: GameDataService) {
    }

    ngAfterViewInit() {
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

    openTieBreakerModal() {
        $('#tie-breaker-pick-modal').foundation('open');
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

    private _setTieBreaker() {
        if (this.game.tieBreakers && this.game.tieBreakers.get(this.game.week.weekNumber)) {
            this.tieBreaker = this.game.tieBreakers.get(this.game.week.weekNumber);
        } else {
            this.tieBreaker = null;
        }
    }
}
