import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule }
  from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { FilmsComponent } from './films/films.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';


import { MatInputModule } from '@angular/material/input';



import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';




@NgModule({
  declarations: [
    AppComponent,
    FilmsComponent,
    HomeComponent,
    InfoComponent

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
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
