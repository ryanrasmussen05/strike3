import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Pick } from './pick';
import { Team } from '../team/team';

@Injectable()
export class PickModel {
  allPicks$: BehaviorSubject<Pick[]> = new BehaviorSubject<Pick[]>(null);

  allTeams: Team[] = [
    {name: 'Arizona Cardinals', abbreviation: 'ARZ'},
    {name: 'Atlanta Falcons', abbreviation: 'ATL'},
    {name: 'Baltimore Ravens', abbreviation: 'BAL'},
    {name: 'Buffalo Bills', abbreviation: 'BUF'},
    {name: 'Carolina Panthers', abbreviation: 'CAR'},
    {name: 'Chicago Bears', abbreviation: 'CHI'},
    {name: 'Cincinnati Bengals', abbreviation: 'CIN'},
    {name: 'Cleveland Brows', abbreviation: 'CLE'},
    {name: 'Dallas Cowboys', abbreviation: 'DAL'},
    {name: 'Denver Broncos', abbreviation: 'DEN'},
    {name: 'Detroit Lions', abbreviation: 'DET'},
    {name: 'Green Bay Packers', abbreviation: 'GB'},
    {name: 'Houston Texans', abbreviation: 'HOU'},
    {name: 'Indianapolis Colts', abbreviation: 'IND'},
    {name: 'Jacksonville Jaguars', abbreviation: 'JAX'},
    {name: 'Kansas City Chiefs', abbreviation: 'KC'},
    {name: 'Los Angeles Chargers', abbreviation: 'LAC'},
    {name: 'Los Angeles Rams', abbreviation: 'LAR'},
    {name: 'Miami Dolphins', abbreviation: 'MIA'},
    {name: 'Minnesota Vikings', abbreviation: 'MIN'},
    {name: 'New England Patriots', abbreviation: 'NE'},
    {name: 'New Orleans Saints', abbreviation: 'NO'},
    {name: 'New York Giants', abbreviation: 'NYG'},
    {name: 'New York Jets', abbreviation: 'NYJ'},
    {name: 'Oakland Raiders', abbreviation: 'OAK'},
    {name: 'Philadelphia Eagles', abbreviation: 'PHI'},
    {name: 'Pittsburgh Steelers', abbreviation: 'PIT'},
    {name: 'San Francisco 49ers', abbreviation: 'SF'},
    {name: 'Seattle Seahawks', abbreviation: 'SEA'},
    {name: 'Tampa Bay Buccaneers', abbreviation: 'TB'},
    {name: 'Tennessee Titans', abbreviation: 'TEN'},
    {name: 'Washington Redskins', abbreviation: 'WAS'}
  ];

  setPicks(picks: Pick[]) {
    console.log('set picks');
    this.allPicks$.next(picks);
  }
}
