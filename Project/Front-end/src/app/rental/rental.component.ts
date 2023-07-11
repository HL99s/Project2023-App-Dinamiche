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

const GET_STAFF_ID = gql`
  query  getStaffIdByStoreId($storeId: Int){
    getStaffIdByStoreId(storeId: $storeId){
      staff_id
    }
  }
`;

const RENTAL_INSERT_MUTATION = gql`
  mutation rentalInsert($rental_date: Date, $inventory_id: Int, $customer_id: Int, $staff_id: Int, $last_update: Date) {
    rentalInsert(rental_date: $rental_date, inventory_id: $inventory_id, customer_id: $customer_id, staff_id: $staff_id, last_update: $last_update) {
      rental_id
    }
  }
`;

interface getBuyDispResponse {
  getBuyDisp: {
    inventory_id: number
  }
}

interface getFilmInfoByIdResponse {
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

interface getStoreDispByFilmIdResponse {
  getStoreDispByFilmId: {
    store_id: number,
    address: string,
    city: string,
    country: string
  }
}

interface getStaffIdByStoreIdResponse {
  getStaffIdByStoreId: {
    staff_id: number,
  }
}

interface rentalInsertResponse {
  rentalInsert: {
    rental_id: number,
  }
}

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  film: any;
  stores: any;
  rental_dates: any;
  selected_store: any;
  disp_store: any;
  available: boolean;
  selected_date: Date;
  staff: any;
  cust_id = localStorage.getItem("ID");
  insertResult: boolean;


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
    //this.getInvDisp()
    this.dialog.open(AfterBuyDialog, {data: {result: true}});
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


  getInvDisp() {
    this.apollo.query<getBuyDispResponse>({
      query: GET_BUY_DISP,
      variables: {filmId: this.arg.film_id, storeId: Number(this.selected_store)}
    }).subscribe(({data, loading}) => {

      this.disp_store = data.getBuyDisp.inventory_id
      console.log("inv: ", this.disp_store)
      console.log("Store: ", this.selected_store)
      console.log("Date: ", this.selected_date)

      this.getStaffInfo()
    })
  }

  getStaffInfo() {
    this.apollo.query<getStaffIdByStoreIdResponse>({
      query: GET_STAFF_ID,
      variables: {storeId: Number(this.selected_store)}
    }).subscribe(({data, loading}) => {

      this.staff = data.getStaffIdByStoreId.staff_id;
      console.log("Staff: ", this.staff);
      this.getInsertInfo()

    })

  }

  getInsertInfo() {
    this.apollo
      .mutate<rentalInsertResponse>({
        mutation: RENTAL_INSERT_MUTATION,
        variables: {
          rental_date: this.selected_date,
          inventory_id: this.disp_store,
          customer_id: Number(this.cust_id),
          staff_id: this.staff,
          last_update: this.selected_date
        }
      }).subscribe({
      next: (res) => {
        console.log(res.data?.rentalInsert)
        if (res.data?.rentalInsert != null) {
          this.insertResult = true;
        } else {
          this.insertResult = false;
        }

        this.openResult();
      },
      error: (e) => {
        console.log("there was an error sending the query", e);
      }
    });

  }

  openResult() {
    const rent_dialog = this.dialog.open(AfterBuyDialog, {data: {result: this.insertResult}});
    rent_dialog.afterClosed().subscribe(result => {
      location.reload()
    });
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

