import { Component, OnInit } from '@angular/core';
import { UserModel } from '../user/user.model';

import * as firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    config = {
        apiKey: 'AIzaSyAJG85EJA1lBmYS31zcOqjSECZ2YSpWHxo',
        authDomain: 'strike3-31769.firebaseapp.com',
        databaseURL: 'https://strike3-31769.firebaseio.com/',
        projectId: 'strike3-31769',
        storageBucket: 'gs://strike3-31769.appspot.com'
    };

    constructor(public userModel: UserModel) {
    }

    ngOnInit(): void {
        firebase.initializeApp(this.config);
        this.userModel.init();
    }
}
