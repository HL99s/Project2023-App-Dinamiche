import {Component, Inject, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import gql from 'graphql-tag';

const RENTALS_BY_REN_ID_QUERY = gql`
  query getRentalInfoByRenId($rentalId : Int!) {
    getRentalInfoByRenId(rentalId : $rentalId){
      rental_id
      film_title
      payment_date
      amount
      shop
      rental_date
      return_date
      staff_first_name
      staff_last_name
      staff_email
    }
  }
`;

const STORE_BY_ID_QUERY = gql`
  query getStoreById($storeId : Int!) {
    getStoreById(storeId : $storeId){
      address
      city
      country
    }
  }
`;

interface getRentalInfoByRenIdResponse{
  getRentalInfoByRenId: {
    rental_id: number,
    film_title: string,
    payment_date: Date,
    amount: number,
    shop: string,
    rental_date: Date,
    return_date: Date,
    staff_first_name: string,
    staff_last_name: string,
    staff_email: string
  }
}

interface getStoreByIdResponse{
  getStoreById: {
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

type RentalInfo = {
  rental_id: number,
  film_title: string,
  payment_date: Date,
  amount: number,
  shop: string,
  rental_date: Date,
  return_date: Date,
  staff_first_name: string,
  staff_last_name: string,
  staff_email: string
}

@Component({
  selector: 'app-info-rental',
  templateUrl: './rental_info.component.html',
  styleUrls: ['./rental_info.component.css']
})
export class Rental_infoComponent implements OnInit {

  rental_info: RentalInfo;
  store: Store;


  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any) {
  }

  ngOnInit(): void {
    this.apollo.query<getRentalInfoByRenIdResponse>({
      query: RENTALS_BY_REN_ID_QUERY,
      variables: {rentalId: this.arg.rental_id}
    }).subscribe(({data, loading}) => {
      this.rental_info = data.getRentalInfoByRenId
      console.log(this.rental_info)
    })

    this.apollo.query<getStoreByIdResponse>({
      query: STORE_BY_ID_QUERY,
      variables: {storeId: this.arg.store_id}
    }).subscribe(({data, loading}) => {
      this.store = data.getStoreById
      console.log(this.store)
    })
  }

}
