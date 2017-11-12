import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { GameDataService } from '../../gameData/game.data.service';
import { GameDataModel } from '../../gameData/game.data.model';
import { UserModel } from '../../user/user.model';
import { PickService } from '../../pick/pick.service';
import { PickModel } from '../../pick/pick.model';

@Injectable()
export class AdminPageResolver implements Resolve<boolean> {

  constructor(public gameDataService: GameDataService, public gameDataModel: GameDataModel, public userModel: UserModel,
              public loadingService: LoadingService, public pickService: PickService, public pickModel: PickModel) {
  }

  resolve(): Promise<boolean> {
    console.log('resolving admin view');
    const firstLoad: boolean = this.gameDataModel.allPlayers$.getValue() === null
      || this.gameDataModel.week$.getValue() === null
      || this.pickModel.allPicksAdmin$.getValue() === null;

    const resolvePromise = this.gameDataService.getGameData().then(() => {
      const currentUser = this.userModel.currentUser$.getValue();

      if (currentUser) {
        const isAdmin = this.gameDataModel.canAccessAdmin(currentUser.uid);

        if (isAdmin) {
          return this.pickService.getAllPicks();
        }
      }
    });

    if (!firstLoad) {
      return Promise.resolve(true);
    } else {
      this.loadingService.loading();
      return resolvePromise.then(() => {
        this.loadingService.done();
        return true;
      }).catch((error) => {
        this.loadingService.done();
        console.error(error);
        return false;
      });
    }
  }
}
