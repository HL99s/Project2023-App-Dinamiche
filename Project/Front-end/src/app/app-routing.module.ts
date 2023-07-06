import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {FilmsComponent} from './films/films.component';
import {LoginComponent} from './login/login.component';
import {HistoryComponent} from './history/history.component';
import {HistoprovaComponent} from './histoprova/histoprova.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'films',
    component: FilmsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rental_history',
    component: HistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rentals_history',
    component: HistoprovaComponent,
    canActivate: [AuthGuard]
  },
  //redirect to home if other paths
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
