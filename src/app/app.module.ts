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
import { PlayerViewComponent } from './components/playerView/player.view.component';
import { PlayerViewModel } from './viewModel/player.view.model';
import { PlayerViewResolver } from './components/playerView/player.view.resolver';
import { PickComponent } from './components/pick/pick.component';
import { AdminViewComponent } from './components/adminView/admin.view.component';
import { AdminViewResolver } from './components/adminView/admin.view.resolver';
import { AdminViewModel } from './viewModel/admin.view.model';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayerViewComponent,
    LoginComponent,
    LoadingComponent,
    PickComponent,
    AdminViewComponent
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
    LoadingService,
    PlayerViewResolver,
    AdminViewResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
