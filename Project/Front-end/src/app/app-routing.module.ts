import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {FilmsComponent} from './films/films.component';
import {LoginComponent} from './login/login.component';
import { HistoryComponent } from './history/history.component';
import { HistoprovaComponent } from './histoprova/histoprova.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'films',
    component: FilmsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'rental_history',
    component: HistoryComponent
  },
  {
    path: 'hist',
    component: HistoprovaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
