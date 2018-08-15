import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { GameDataService } from '../../gameData/game.data.service';
import { UserModel } from '../../user/user.model';

import * as firebase from 'firebase/app';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: firebase.User;
    originalFirstName: string;
    originalLastName: string;

    firstName: string;
    lastName: string;

    error: boolean = false;
    loading: boolean = false;

    constructor(public userService: UserService, public userModel: UserModel, public gameDataService: GameDataService, public zone: NgZone) {
    }

    ngOnInit() {
        $('#profile-modal').on('open.zf.reveal', () => {
            this.zone.run(() => {
                this.error = false;
                this.loading = false;

                this.user = this.userModel.currentUser$.getValue();
                this.originalFirstName = this.user.displayName.split(' ')[0];
                this.originalLastName = this.user.displayName.split(' ')[1];
                this.firstName = this.originalFirstName;
                this.lastName = this.originalLastName;
            });
        });
    }

    ngOnDestroy() {
        $('#profile-modal').off('open.zf.reveal');
    }

    updateProfile() {
        this.loading = true;
        this.error = false;

        const updatedName = this.firstName + ' ' + this.lastName;

        this.userService.setUsername(this.user, updatedName).then(() => {
            this.gameDataService.changePlayerName(this.user, updatedName).then(() => {
                this.loading = false;
                this._closeModal();
            });
        }).catch((error: firebase.auth.Error) => {
            console.error(error);
            this.loading = false;
            this.error = true;
        });
    }

    isChanged(): boolean {
        return this.firstName !== this.originalFirstName || this.lastName !== this.originalLastName;
    }

    private _closeModal() {
        $('#profile-modal').foundation('close');
    }
}
