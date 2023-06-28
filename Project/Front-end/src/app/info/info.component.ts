import { publishFacade } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, ApolloModule } from 'apollo-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import gql from 'graphql-tag';
import { RentalComponent } from '../rental/rental.component';

const FILM_INFO_BY_ID = gql`
query getFilmInfoById($filmId: Int){
  getFilmInfoById(filmId: $filmId){
    film_title
    release_year
    language
    length
    category
    description
    rating
    cost
  }
}
`;

const FILM_ACTORS = gql`
query getFilmActors($filmId: Int){
  getFilmActors(filmId: $filmId){
    first_name
    last_name
  }
}
`;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit{

  film: any;
  actors: any;
  size: Number;

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any, public dialog: MatDialog){}
  ngOnInit(): void {
    this.apollo.query({
      query: FILM_INFO_BY_ID,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading})=>{
      this.film = data
    })

    this.apollo.query({
      query: FILM_ACTORS,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading})=>{
      this.actors = data
    })
  }
  openRental(){
    this.dialog.open(RentalComponent, {data: {film_id: this.arg.film_id}})
  }
}
