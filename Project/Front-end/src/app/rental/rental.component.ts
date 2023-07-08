import {Component, Inject, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';


import gql from 'graphql-tag';

const GET_BUY_DISP = gql`
  query getBuyDisp($filmId: Int, $storeId: Int){
    getBuyDisp(filmId: $filmId, storeId: $storeId){
      inventory_id
    }
  }
`;


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

const STORE_INFO_DISP = gql`
  query getStoreDispByFilmId($filmId: Int){
    getStoreDispByFilmId(filmId: $filmId){
      store_id
      address
      city
      country
    }
  }
`;

interface getBuyDispResponse{
  getBuyDisp: {
    inventory_id: number
  }
}

interface getFilmInfoByIdResponse{
  getFilmInfoById: {
    film_title: string,
    release_year: number,
    language: string,
    length: string,
    category: string,
    description: string,
    rating: string,
    cost: number,
    rental_duration: number
  }
}

interface getStoreDispByFilmIdResponse{
  getStoreDispByFilmId: {
    store_id: number,
    address: string,
    city: string,
    country: string
  }
}

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  film: any;
  res: boolean;
  stores: any;
  rental_dates: any;
  selected_store: any;
  disp_store: any;
  available: boolean;

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apollo.query<getFilmInfoByIdResponse>({
      query: FILM_INFO_BY_ID,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {

      this.film = data.getFilmInfoById
    })

    this.apollo.query<getStoreDispByFilmIdResponse>({
      query: STORE_INFO_DISP,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {

      this.stores = data.getStoreDispByFilmId;
      this.available = this.stores.length != 0;
    })
    this.get_rental_dates()
  }

  openPopup() {
    this.apollo.query<getBuyDispResponse>({
      query: GET_BUY_DISP,
      variables: {filmId: this.arg.film_id, storeId: Number(this.selected_store)}
    }).subscribe(({data, loading}) => {

      this.disp_store = data.getBuyDisp
      console.log(this.disp_store)
      this.res = this.disp_store.length != 0;
      this.dialog.open(AfterBuyDialog, {data: {result: this.res}});
    })

  }

  get_rental_dates() {
    let re_d = [];
    let now = new Date()
    re_d.push(now.toDateString())
    for (let i = 0; i < 2; i++) {
      now.setDate(now.getDate() + 1)
      re_d.push(now.toDateString())
    }
    this.rental_dates = re_d

  }
}

@Component({
  selector: 'after_buy',
  templateUrl: '../rentalConfirmPopUp/rentalConfirmPopUp.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf],
})

export class AfterBuyDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}

