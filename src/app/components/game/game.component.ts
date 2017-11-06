import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameModel } from '../../game/game.model';
import { Game } from '../../game/game';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game: Game;
  gameSubscription: Subscription;

  constructor(public gameModel: GameModel) {
  }

  ngOnInit() {
    this.gameSubscription = this.gameModel.game$.subscribe((game) => {
      this.game = game;
    });
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
