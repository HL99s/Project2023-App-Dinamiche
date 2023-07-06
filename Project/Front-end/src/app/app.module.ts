import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {GraphQLModule} from './auth/graphql.module';
import {FilmsComponent} from './films/films.component';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {Film_infoComponent} from './film_info/film_info.component';
import {RentalComponent} from './rental/rental.component';
import {Rental_infoComponent} from './rental_info/rental_info.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule, NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {RentalsHistoryComponent} from './rentalsHistory/rentalsHistory.component';
import {ConvertiDurataPipe} from './utility/converti-durata-pipe.pipe';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    FilmsComponent,
    HomeComponent,
    Film_infoComponent,
    RentalComponent,
    RentalsHistoryComponent,
    Rental_infoComponent,
    ConvertiDurataPipe
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
    MatSlideToggleModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
