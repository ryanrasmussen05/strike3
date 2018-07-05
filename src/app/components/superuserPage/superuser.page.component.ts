import { Component } from '@angular/core';
import { AdminPageComponent } from '../adminPage/admin.page.component';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { NFLService } from '../../nfl/nfl.service';
import { GameDataService } from '../../gameData/game.data.service';
import { NFLGame } from '../../gameData/nfl.schedule';
import { LoadingService } from '../../loading/loading.service';
import { ContextModel } from '../context.model';

@Component({
    templateUrl: './superuser.page.component.html',
    styleUrls: ['./superuser.page.component.scss']
})
export class SuperuserPageComponent extends AdminPageComponent {

    schedule: Map<number, NFLGame[]>;

    constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public adminViewModel: AdminViewModel, public nflService: NFLService,
                public gameDataService: GameDataService, public loadingService: LoadingService, public contextModel: ContextModel) {
        super(userModel, gameDataModel, gameDataService, adminViewModel, loadingService, contextModel);
    }

    fetchSchedule() {
        this.nflService.getNflSchedule().then((schedule) => {
            console.log(schedule);
            this.schedule = schedule;
        });
    }

    postSchedule() {
        this.gameDataService.setSchedule(this.schedule).then(() => {
            console.log('schedule updated');
        }).catch((error) => {
            console.error(error);
        });
    }
}
