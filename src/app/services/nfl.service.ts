import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NFLSchedule, NFLScoreboard, NFLServiceSchedule, NFLServiceScoreboard } from '../models/nfl.schedule';
import { ConvertNflSchedule, ConvertNflScoreboard } from '../util/nfl.util';

@Injectable()
export class NFLService {
    nflApiScheduleEndpoint = 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2018-2019-regular/full_game_schedule.json';
    nflApiScoreboardEndpoint = 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2018-2019-regular/scoreboard.json?fordate=';
    nflApiAuth = 'rlras05:strike3'; // username:password

    constructor(private http: HttpClient) {
    }

    getNflSchedule(): Promise<NFLSchedule> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + btoa(this.nflApiAuth));

        return this.http.get(this.nflApiScheduleEndpoint, {headers: headers}).toPromise()
            .then((nflServiceSchedule: NFLServiceSchedule) => {
                return ConvertNflSchedule(nflServiceSchedule);
            });
    }

    getScoreboardForDate(date: string): Promise<NFLScoreboard> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + btoa(this.nflApiAuth));

        return this.http.get(this.nflApiScoreboardEndpoint + date + '&status=final', {headers: headers}).toPromise()
            .then((nflServiceScoreboard: NFLServiceScoreboard) => {
                return ConvertNflScoreboard(nflServiceScoreboard);
            });
    }
}
