import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { UserModel } from './user/user.model';
import { UserService } from './user/user.service';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './loading/loading.service';
import { GameDataService } from './gameData/game.data.service';
import { GameDataModel } from './gameData/game.data.model';
import { PlayerViewModel } from './viewModel/player.view.model';
import { PickComponent } from './components/pick/pick.component';
import { AdminViewModel } from './viewModel/admin.view.model';
import { ViewModelUtil } from './viewModel/view.model.util';
import { AdminPageComponent } from './components/adminPage/admin.page.component';
import { PlayerPageComponent } from './components/playerPage/player.page.component';
import { GameTableComponent } from './components/gameTable/game.table.component';
import { TeamModel } from './gameData/team.model';
import { PickLogComponent } from './components/adminPage/pickLog/pick.log.component';
import { NFLService } from './nfl/nfl.service';
import { HttpClientModule } from '@angular/common/http';
import { SuperuserPageComponent } from './components/superuserPage/superuser.page.component';
import { GameDataResolver } from './components/game.data.resolver';

import * as $ from 'jquery';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PlayerPageComponent,
        LoginComponent,
        LoadingComponent,
        PickComponent,
        AdminPageComponent,
        GameTableComponent,
        PickLogComponent,
        SuperuserPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        UserModel,
        UserService,
        TeamModel,
        GameDataModel,
        GameDataService,
        PlayerViewModel,
        AdminViewModel,
        ViewModelUtil,
        LoadingService,
        NFLService,
        GameDataResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
