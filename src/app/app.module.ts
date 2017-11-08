import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './components/game/game.component';
import { FormsModule } from '@angular/forms';
import { UserModel } from './user/user.model';
import { UserService } from './user/user.service';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { PickModel } from './pick/pick.model';
import { PickService } from './pick/pick.service';
import { LoadingComponent } from './components/loading/loading.component';
import { GameModel } from './game/game.model';
import { GameResolver } from './components/game/game.resolver';
import { LoadingService } from './loading/loading.service';
import { GameDataService } from './gameData/game.data.service';
import { GameDataModel } from './gameData/game.data.model';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameComponent,
    LoginComponent,
    LoadingComponent
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
    GameModel,
    LoadingService,
    GameResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
