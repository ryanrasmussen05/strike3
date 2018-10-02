import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { combineLatest } from 'rxjs';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { CanUserAccessAdmin, CanUserAccessSuperuser } from '../../util/game.data.util';
import { SignOutUser } from '../../actions/user.actions';
import { UserSelector } from '../../reducers/user.reducer';
import { User } from '../../models/user';
import { BsModalService } from 'ngx-bootstrap';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    user: User;
    admin: boolean;
    superuser: boolean;

    constructor(private store: Store<AppState>, private modalService: BsModalService) {
    }

    ngOnInit(): void {
        combineLatest(this.store.pipe(select(UserSelector)), this.store.pipe(select(GameDataSelector))).subscribe(([user, gameData]) => {
            this.user = user;

            if (gameData) {
                this.admin = CanUserAccessAdmin(gameData, user ? user.uid : null);
                this.superuser = CanUserAccessSuperuser(gameData, user ? user.uid : null);
            }
        });
    }

    showLoginModal() {
        this.modalService.show(LoginComponent);
    }

    openProfileModal() {
        this.modalService.show(ProfileComponent);
    }

    signOut() {
        this.store.dispatch(new SignOutUser());
    }
}
