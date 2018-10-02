import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/user';
import { Pick } from '../models/pick';
import { Week } from '../models/week';
import { TieBreaker } from '../models/tie.breaker';
import { NFLSchedule } from '../models/nfl.schedule';
import { NFLScheduleToJSON } from '../util/nfl.util';

@Injectable()
export class GameDataService {

    constructor(private db: AngularFireDatabase) {
    }

    getGameData(): Observable<any> {
        return this.db.object<any>('/').valueChanges().pipe(take(1));
    }

    addPlayerForUser(user: User): Promise<any> {
        const userEntry = {
            name: user.name,
            email: user.email,
            uid: user.uid
        };

        return this.db.object('players/' + user.uid).set(userEntry);
    }

    changePlayerName(user: User, name: string): Promise<any> {
        return this.db.object('players/' + user.uid + '/name').set(name);
    }

    submitPick(pick: Pick, uid: string): Promise<void> {
        return this.db.object('players/' + uid + '/picks/' + pick.week).update(pick);
    }

    setWeek(week: Week): Promise<void> {
        return this.db.object('week').set(week);
    }

    submitTieBreaker(tieBreaker: TieBreaker): Promise<void> {
        return this.db.object('tieBreakers/' + tieBreaker.week).update(tieBreaker);
    }

    deleteTieBreaker(tieBreaker: TieBreaker): Promise<void> {
        return this.db.object('tieBreakers/' + tieBreaker.week).remove();
    }

    setSchedule(nflSchedule: NFLSchedule): Promise<void> {
        return this.db.object('schedule').set(NFLScheduleToJSON(nflSchedule));
    }
}
