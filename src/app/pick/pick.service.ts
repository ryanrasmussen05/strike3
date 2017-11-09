import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { PickModel } from './pick.model';
import { Pick } from './pick';
import { UserModel } from '../user/user.model';
import { GameDataModel } from '../gameData/game.data.model';
import { Week } from '../gameData/week';

require('firebase/firestore');

@Injectable()
export class PickService {

  PICKS_COLLECTION_ID = 'picks';

  constructor(public pickModel: PickModel, public userModel: UserModel, public gameDataModel: GameDataModel) {
  }

  getViewablePicks(): Promise<Pick[]> {
    const currentWeek: Week = this.gameDataModel.week$.getValue();
    const maxWeekToFetch = currentWeek.locked ? currentWeek.weekNumber : currentWeek.weekNumber - 1;
    const currentUser = this.userModel.currentUser$.getValue();
    const adminUid = this._getAdminUid();

    const queries: firebase.firestore.Query[] = [];

    //all picks for unlocked weeks
    queries.push(firebase.firestore().collection(this.PICKS_COLLECTION_ID).where('week', '<=', maxWeekToFetch));
    //add admin picks for locked weeks
    queries.push(firebase.firestore().collection(this.PICKS_COLLECTION_ID).where('uid', '==', adminUid)
      .where('week', '>', maxWeekToFetch));

    //all picks for current user for locked weeks
    if (currentUser && currentUser.uid !== adminUid) {
      queries.push(firebase.firestore().collection(this.PICKS_COLLECTION_ID).where('uid', '==', currentUser.uid)
        .where('week', '>', maxWeekToFetch));
    }

    const promises: Promise<Pick[]>[] = queries.map((currentQuery) => {
      return this._getPicks(currentQuery);
    });

    return Promise.all(promises).then((viewablePicks) => {
      const allViewablePicks = this._mergePicks(viewablePicks);
      this.pickModel.setPicks(allViewablePicks);
      return allViewablePicks;
    }).catch((error) => {
      console.error(error);
      return [];
    });
  }

  filterPicksForSignOut() {
    const currentPicks: Pick[] = this.pickModel.allPicks$.getValue();
    const currentWeek: Week = this.gameDataModel.week$.getValue();
    const maxWeekToFetch = currentWeek.locked ? currentWeek.weekNumber : currentWeek.weekNumber - 1;
    const adminUid = this._getAdminUid();

    const filteredPicks: Pick[] = [];

    currentPicks.forEach((currentPick: Pick) => {
      if (currentPick.week <= maxWeekToFetch || currentPick.uid === adminUid) {
        filteredPicks.push(currentPick);
      }
    });

    this.pickModel.setPicks(filteredPicks);
  }

  private _getPicks(query: firebase.firestore.Query): Promise<Pick[]> {
    return new Promise((resolve, reject) => {
      const picks = [];

      query.get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
          picks.push(doc.data());
        });
        resolve(picks);

      }).catch((error) => {
        reject(error);
      });
    });
  }

  private _getAdminUid(): string {
    const adminPlayer = this.gameDataModel.allPlayers$.getValue().find((currentPlayer) => {
      return currentPlayer.admin;
    });

    return adminPlayer.uid;
  }

  private _mergePicks(pickArrays: Pick[][]): Pick[] {
    const mergedPicks: Pick[] = [];

    pickArrays.forEach((pickArray: Pick[]) => {
      mergedPicks.push(...pickArray);
    });

    return mergedPicks;
  }
}
