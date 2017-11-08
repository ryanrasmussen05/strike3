import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerViewComponent } from './components/playerView/player.view.component';
import { PlayerViewResolver } from './components/playerView/player.view.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  {
    path: 'player',
    component: PlayerViewComponent,
    resolve: { dataLoaded: PlayerViewResolver }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
