import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NFLServiceSchedule } from './nfl.service.schedule';
import { NFLSchedule, NFLScheduleUtil } from '../gameData/nfl.schedule';
import { NFLScoreboard, NFLScoreboardUtil } from '../gameData/nfl.scoreboard';
import { NFLServiceScoreboard } from './nfl.service.scoreboard';

@Injectable()
export class NFLService {
    nflApiScheduleEndpoint = 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2018-2019-regular/full_game_schedule.json';
    nflApiScoreboardEndpoint = 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2018-2019-regular/scoreboard.json?fordate=';
    nflApiAuth = 'rlras05:strike3'; //username:password

    constructor(public http: HttpClient) {
    }

    getNflSchedule(): Promise<NFLSchedule> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + btoa(this.nflApiAuth));

        return this.http.get(this.nflApiScheduleEndpoint, {headers: headers}).toPromise()
            .then((nflServiceSchedule: NFLServiceSchedule) => {
                return NFLScheduleUtil.ParseFromService(nflServiceSchedule);
            });
    }

    getScoreboardForDate(date: string): Promise<NFLScoreboard> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + btoa(this.nflApiAuth));

        return this.http.get(this.nflApiScoreboardEndpoint + date + '&status=final', {headers: headers}).toPromise()
            .then((nflServiceScoreboard: NFLServiceScoreboard) => {
                return NFLScoreboardUtil.ParseFromService(nflServiceScoreboard);
            });
    }
}
