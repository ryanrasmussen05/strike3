import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerViewComponent } from './components/playerView/player.view.component';
import { PlayerViewResolver } from './components/playerView/player.view.resolver';
import { AdminViewComponent } from './components/adminView/admin.view.component';
import { AdminViewResolver } from './components/adminView/admin.view.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  {
    path: 'player',
    component: PlayerViewComponent,
    resolve: { dataLoaded: PlayerViewResolver }
  },
  {
    path: 'admin',
    component: AdminViewComponent,
    resolve: { dataLoaded: AdminViewResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
