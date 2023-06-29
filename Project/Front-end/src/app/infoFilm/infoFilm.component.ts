import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Apollo} from 'apollo-angular';
import {MatDialog} from '@angular/material/dialog';


import gql from 'graphql-tag';
import {RentalComponent} from '../rental/rental.component';

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
    rental_duration
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
  templateUrl: './infoFilm.component.html',
  styleUrls: ['./infoFilm.component.css']
})
export class InfoFilmComponent implements OnInit {

  film: any;
  actors: any;


  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apollo.query({
      query: FILM_INFO_BY_ID,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.film = data.getFilmInfoById
    })

    this.apollo.query({
      query: FILM_ACTORS,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.actors = data.getFilmActors
    })
  }

  openRental() {
    this.dialog.open(RentalComponent, {data: {film_id: this.arg.film_id}})
  }
}
