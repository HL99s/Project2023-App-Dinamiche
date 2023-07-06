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


@Component({
  selector: 'app-info-rental',
  templateUrl: './rental_info.component.html',
  styleUrls: ['./rental_info.component.css']
})
export class Rental_infoComponent implements OnInit {

  rental_info: any;
  store: any;

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any) {
  }

  ngOnInit(): void {
    this.apollo.query({
      query: RENTALS_BY_REN_ID_QUERY,
      variables: {rentalId: this.arg.rental_id}
    }).subscribe(({data, loading}) => {
      //@ts-ignore
      this.rental_info = data.getRentalInfoByRenId
    })

    this.apollo.query({
      query: STORE_BY_ID_QUERY,
      variables: {storeId: this.arg.store_id}
    }).subscribe(({data, loading}) => {
      console.log(this.arg.store_id)
      //@ts-ignore
      this.store = data.getStoreById
    })


  }

}
