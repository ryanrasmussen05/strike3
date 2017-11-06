import { Component } from '@angular/core';
import { GameModel } from '../../game/game.model';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  constructor(public gameModel: GameModel) {
  }
}
