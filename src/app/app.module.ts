import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { GameDataService } from './services/game.data.service';
import { storeLogger } from 'ngrx-store-logger';
import { storeFreeze } from 'ngrx-store-freeze';
import { AppState, reducers } from './reducers';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { effects } from './effects';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { PlayerPageComponent } from './components/pages/playerPage/player.page.component';
import { GameDataResolver } from './resolvers/game.data.resolver';
import { LoadingComponent } from './components/loading/loading.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GameTableComponent } from './components/gameTable/game.table.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PickComponent } from './components/pick/pick.component';
import { AdminPageComponent } from './components/pages/adminPage/admin.page.component';
import { NFLService } from './services/nfl.service';
import { HttpClientModule } from '@angular/common/http';
import { TieBreakerComponent } from './components/tieBreaker/tie.breaker.component';
import { TieBreakerFormComponent } from './components/tieBreaker/tie.breaker.form';
import { TieBreakerResultComponent } from './components/tieBreaker/tie.breaker.result';
import { PickLogComponent } from './components/pickLog/pick.log.component';
import { RosterComponent } from './components/roster/roster.component';
import { EmailComponent } from './components/email/email.component';
import { EmailService } from './services/email.service';
import { AngularFireFunctionsModule } from 'angularfire2/functions';
import { TieBreakerPickComponent } from './components/tieBreakerPick/tie.breaker.pick.component';
import { ViewTieBreakersComponent } from './components/viewTieBreakers/view.tie.breakers.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SuperuserPageComponent } from './components/pages/superuserPage/superuser.page.component';
import { AngularFireStorageModule } from 'angularfire2/storage';

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return storeLogger({ collapsed: true })(reducer);
}

export const metaReducers = environment.production ? [] : [
    logger, // console log all dispatched actions (use in development environment only)
    storeFreeze // trigger an exception if state is ever mutated (use in development environment only)
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireFunctionsModule,
        AngularFireStorageModule,
        EffectsModule.forRoot(effects),
        StoreModule.forRoot(reducers, {metaReducers: metaReducers}),
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        TabsModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoadingComponent,
        HeaderComponent,
        LoginComponent,
        ProfileComponent,
        PlayerPageComponent,
        AdminPageComponent,
        SuperuserPageComponent,
        GameTableComponent,
        PickComponent,
        TieBreakerComponent,
        TieBreakerFormComponent,
        TieBreakerResultComponent,
        PickLogComponent,
        RosterComponent,
        EmailComponent,
        TieBreakerPickComponent,
        ViewTieBreakersComponent
    ],
    entryComponents: [
        LoginComponent,
        PickComponent,
        TieBreakerPickComponent,
        ViewTieBreakersComponent,
        ProfileComponent,
        TieBreakerFormComponent,
        TieBreakerResultComponent
    ],
    providers: [
        GameDataService,
        UserService,
        NFLService,
        GameDataResolver,
        EmailService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
