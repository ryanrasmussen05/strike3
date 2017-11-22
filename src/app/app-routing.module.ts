import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './components/adminPage/admin.page.component';
import { PlayerPageComponent } from './components/playerPage/player.page.component';
import { SuperuserPageComponent } from './components/superuserPage/superuser.page.component';
import { GameDataResolver } from './components/game.data.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  {
    path: 'player',
    component: PlayerPageComponent,
    resolve: { dataLoaded: GameDataResolver }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    resolve: { dataLoaded: GameDataResolver }
  }, {
    path: 'superuser',
    component: SuperuserPageComponent,
    resolve: { dataLoaded: GameDataResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
