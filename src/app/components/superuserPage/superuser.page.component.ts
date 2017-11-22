import { Component } from '@angular/core';
import { AdminPageComponent } from '../adminPage/admin.page.component';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { NFLService } from '../../nfl/nfl.service';
import { GameDataService } from '../../gameData/game.data.service';
import { NFLGame } from '../../gameData/nfl.schedule';

@Component({
  templateUrl: './superuser.page.component.html'
})
export class SuperuserPageComponent extends AdminPageComponent {

  schedule: Map<number, NFLGame[]>;

  constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public adminViewModel: AdminViewModel,
              public nflService: NFLService, public gameDataService: GameDataService) {
    super(userModel, gameDataModel, adminViewModel);
  }

  fetchSchedule() {
    this.nflService.getNflSchedule().then((schedule) => {
      console.log(schedule);
      this.schedule = schedule;
    });
  }

  postSchedule() {
    this.gameDataService.setSchedule(this.schedule);
  }
}
