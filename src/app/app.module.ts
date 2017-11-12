import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { UserModel } from './user/user.model';
import { UserService } from './user/user.service';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { PickModel } from './pick/pick.model';
import { PickService } from './pick/pick.service';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './loading/loading.service';
import { GameDataService } from './gameData/game.data.service';
import { GameDataModel } from './gameData/game.data.model';
import { PlayerViewModel } from './viewModel/player.view.model';
import { PickComponent } from './components/pick/pick.component';
import { AdminViewModel } from './viewModel/admin.view.model';
import { ViewModelUtil } from './viewModel/view.model.util';
import { AdminPageComponent } from './components/adminPage/admin.page.component';
import { AdminPageResolver } from './components/adminPage/admin.page.resolver';
import { PlayerPageComponent } from './components/playerPage/player.page.component';
import { PlayerPageResolver } from './components/playerPage/player.page.resolver';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayerPageComponent,
    LoginComponent,
    LoadingComponent,
    PickComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    UserModel,
    UserService,
    PickModel,
    PickService,
    GameDataModel,
    GameDataService,
    PlayerViewModel,
    AdminViewModel,
    ViewModelUtil,
    LoadingService,
    PlayerPageResolver,
    AdminPageResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
