import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { GameDataModel } from '../../gameData/game.data.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: firebase.User;
  admin: boolean;

  constructor(public userModel: UserModel, public userService: UserService, public router: Router, public gameDataModel: GameDataModel) {
  }

  ngOnInit(): void {
    $('#header').foundation();

    this.userModel.currentUser$.merge(this.gameDataModel.gameData$).subscribe(() => {
      this.user = this.userModel.currentUser$.getValue();
      this.admin = this.gameDataModel.canAccessAdmin(this.user ? this.user.uid : null);
    });
  }

  signOut() {
    this.userService.signOut().then(() => {
      this.router.navigate(['player']);
    });
  }
}
