import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { PickModel } from './pick.model';
import { Pick } from './pick';

require('firebase/firestore');

@Injectable()
export class PickService {

  constructor(public pickModel: PickModel) {
  }

  getAllPicks(): Promise<Pick[]> {
    return new Promise((resolve, reject) => {
      const picks = [];

      firebase.firestore().collection('picks').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          picks.push(doc.data());
        });
        this.pickModel.setPicks(picks);
        resolve(picks);
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
