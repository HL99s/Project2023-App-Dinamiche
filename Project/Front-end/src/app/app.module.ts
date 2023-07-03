import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule}
  from '@angular/common/http';
import {GraphQLModule} from './graphql.module';
import {FilmsComponent} from './films/films.component';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {InfoFilmComponent} from './infoFilm/infoFilm.component';
import {RentalComponent} from './rental/rental.component';


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';

import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { HistoprovaComponent } from './histoprova/histoprova.component';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    AppComponent,
    FilmsComponent,
    HomeComponent,
    InfoFilmComponent,
    RentalComponent,
    HistoprovaComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    NgFor,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FlexLayoutModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
