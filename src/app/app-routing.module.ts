import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerPageComponent } from './components/pages/playerPage/player.page.component';
import { GameDataResolver } from './resolvers/game.data.resolver';
import { AdminPageComponent } from './components/pages/adminPage/admin.page.component';
import { SuperuserPageComponent } from './components/pages/superuserPage/superuser.page.component';

const routes: Routes = [
    {path: '', redirectTo: '/player', pathMatch: 'full'},
    {
        path: 'player',
        component: PlayerPageComponent,
        resolve: { dataLoaded: GameDataResolver }
    },
    {
        path: 'admin',
        component: AdminPageComponent,
        resolve: {dataLoaded: GameDataResolver}
    },
    {
        path: 'superuser',
        component: SuperuserPageComponent,
        resolve: {dataLoaded: GameDataResolver}
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
