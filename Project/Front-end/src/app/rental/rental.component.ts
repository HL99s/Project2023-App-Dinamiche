import {Component, OnInit, Inject} from '@angular/core';
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
    this.apollo.query({
      query: FILM_INFO_BY_ID,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.film = data.getFilmInfoById
    })

    this.apollo.query({
      query: STORE_INFO_DISP,
      variables: {filmId: this.arg.film_id}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.stores = data.getStoreDispByFilmId;
      if(this.stores.length!=0){
        this.available = true;
      }
      else
        this.available = false;
    })
    this.get_rental_dates()
  }

  openPopup() {
    this.apollo.query({
      query: GET_BUY_DISP,
      variables: {filmId: this.arg.film_id, storeId: Number(this.selected_store)}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.disp_store = data.getBuyDisp
      console.log(this.disp_store)
      if(this.disp_store.length!=0){
        this.res = true;
      }
      else{
        this.res = false;
      }
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
  templateUrl: '../rentalConfirmPopUp/after_buy.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf],
})
export class AfterBuyDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}

