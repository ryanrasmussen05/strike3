import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UserModel } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { GameDataModel } from '../../gameData/game.data.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: firebase.User;
  isAdmin: boolean = false;

  constructor(public userModel: UserModel, public userService: UserService, public gameDataModel: GameDataModel) {
  }

  ngOnInit(): void {
    $('#header').foundation();

    this.userModel.currentUser$.subscribe((currentUser) => {
      this.user = currentUser;
    });

    this.userModel.currentUser$.merge(this.gameDataModel.allPlayers$).subscribe(() => {
      const currentUser = this.userModel.currentUser$.getValue();
      this.isAdmin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
    });
  }

  signOut() {
    this.userService.signOut();
  }
}
