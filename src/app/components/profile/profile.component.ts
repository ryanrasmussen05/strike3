import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { User } from '../../models/user';
import { UserState, UserStateSelector } from '../../reducers/user.reducer';
import { Subscription } from 'rxjs';
import { UpdateProfile, UpdateProfileReset } from '../../actions/user.actions';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: User;
    originalFirstName: string;
    originalLastName: string;

    firstName: string;
    lastName: string;

    error: boolean = false;
    loading: boolean = false;

    userStateSubscription: Subscription;

    constructor(private store: Store<AppState>, private modalRef: BsModalRef) {
    }

    ngOnInit() {
        this.userStateSubscription = this.store.pipe(select(UserStateSelector)).subscribe((userState: UserState) => {
            this.loading = userState.loading;
            this.error = !!userState.error;
            this.user = userState.user;
            this.firstName = userState.user.name.split(' ')[0];
            this.lastName = userState.user.name.split(' ')[1];

            if (userState.profileUpdateComplete) {
                this.closeModal();
            }
        });
    }

    ngOnDestroy() {
        this.userStateSubscription.unsubscribe();
    }

    updateProfile() {
        const updatedName = this.firstName + ' ' + this.lastName;
        this.store.dispatch(new UpdateProfile({name: updatedName, email: this.user.email, uid: this.user.uid}));
    }

    isChanged(): boolean {
        return this.firstName !== this.originalFirstName || this.lastName !== this.originalLastName;
    }

    closeModal() {
        this.store.dispatch(new UpdateProfileReset());
        this.modalRef.hide();
    }
}
