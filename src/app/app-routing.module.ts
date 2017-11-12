import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './components/adminPage/admin.page.component';
import { AdminPageResolver } from './components/adminPage/admin.page.resolver';
import { PlayerPageComponent } from './components/playerPage/player.page.component';
import { PlayerPageResolver } from './components/playerPage/player.page.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  {
    path: 'player',
    component: PlayerPageComponent,
    resolve: { dataLoaded: PlayerPageResolver }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    resolve: { dataLoaded: AdminPageResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
