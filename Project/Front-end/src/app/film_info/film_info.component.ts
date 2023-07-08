import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Apollo} from 'apollo-angular';


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

const STORE_INFO_DISP = gql`
  query getStoreDispByFilmId($filmId: Int){
    getStoreDispByFilmId(filmId: $filmId){
      address
      city
      country
    }
  }
`;

interface getFilmInfoByIdResponse{
  getFilmInfoById: {
    film_title: string,
    release_year: number,
    language: string,
    length: number
    category: string,
    description: string,
    rating: string,
    cost: number,
    rental_duration: string
  }
}

interface getFilmActorsResponse{
  getFilmActors: {
    first_name: string,
    last_name: string
  }
}

interface getStoreDispByFilmIdResponse{
  getStoreDispByFilmId: {
    address: string,
    city: string,
    country: string
  }
}

type Store = {
  address: string,
  city: string,
  country:string
}

type Film  = {
  film_title: string,
  release_year: number,
  language: string,
  length: number
  category: string,
  description: string,
  rating: string,
  cost: number,
  rental_duration: string
}

type Actor = {
  first_name: string,
  last_name: string
}

@Component({
  selector: 'app-info',
  templateUrl: './film_info.component.html',
  styleUrls: ['./film_info.component.css']
})
export class Film_infoComponent implements OnInit {

  film: Film;
  actors: any;
  stores: any;

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apollo.query<getFilmInfoByIdResponse>({
      query: FILM_INFO_BY_ID,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {

      this.film = data.getFilmInfoById
    })

    this.apollo.query<getFilmActorsResponse>({
      query: FILM_ACTORS,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {

      this.actors = data.getFilmActors
    })

    this.apollo.query<getStoreDispByFilmIdResponse>({
      query: STORE_INFO_DISP,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {

      this.stores = data.getStoreDispByFilmId
    })
  }

  openRental() {
    this.dialog.open(RentalComponent, {data: {film_id: this.arg.film_id}})
  }
}
