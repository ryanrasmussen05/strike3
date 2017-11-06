import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { GameResolver } from './components/game/game.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  {
    path: 'game',
    component: GameComponent,
    resolve: { dataLoaded: GameResolver }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
