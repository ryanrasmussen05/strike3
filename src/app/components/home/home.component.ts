import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player/player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public playerService: PlayerService) {
  }

  ngOnInit() {
    this.playerService.getAllPlayers().then((players) => {
      console.log(players);
    }).catch((error) => {
      console.error(error);
    });
  }
}
