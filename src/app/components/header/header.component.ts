import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UserModel } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: firebase.User;

  constructor(public userModel: UserModel, public userService: UserService, public router: Router) {
  }

  ngOnInit(): void {
    $('#header').foundation();

    this.userModel.currentUser$.subscribe((currentUser) => {
      this.user = currentUser;
    });
  }

  signOut() {
    this.userService.signOut().then(() => {
      this.router.navigate(['player']);
    });
  }
}
