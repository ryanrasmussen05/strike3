import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { NFLServiceSchedule } from './nfl.service.schedule';
import { NFLGame, NFLScheduleUtil } from '../gameData/nfl.schedule';

@Injectable()
export class NFLService {
  nflApiEndpoint = 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-2018-regular/full_game_schedule.json';

  constructor(public http: HttpClient) {
  }

  getNflSchedule(): Promise<Map<number, NFLGame[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa('rlras05:strike3'));

    return this.http.get(this.nflApiEndpoint, { headers: headers }).toPromise().then((nflServiceSchedule: NFLServiceSchedule) => {
      return NFLScheduleUtil.parseFromService(nflServiceSchedule);
    });
  }
}
