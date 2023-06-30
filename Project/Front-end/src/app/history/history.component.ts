import {Component, AfterViewInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

//const username = localStorage.getItem("token");

const RENTALS_BY_ID_QUERY = gql`
query getRentalInfoByCustId($customer : Int!) {
  getRentalInfoByCustId(customerId : $customer){
    rental_id
    film_title
    payment_date
    amount
    shop
    rental_date
    return_date
  }
}
`;



export interface History {
  
  Rental_id: number;
  Title: string,
  Shop: string,
  Payment: Date;
  Amount: number,
  TotalDuration: number //numero di millisecondi
 

}

//Dati Fasulli
/*
const ELEMENT_DATA: History[] = [
  { Rental_id: 10,
    Title: "Cat is Angry!!",
    Shop: "BorgoRoma Shop :->",
    Payment: new Date(2023, 6, 1),
    Amount: 100.99,
    TotalDuration: 86400000},

    { Rental_id: 10,
      Title: "Cat is Happy!!",
      Shop: "PoloZanotto Shop :->",
      Payment: new Date(2023, 6, 1),
      Amount: -88,
      TotalDuration: 899400877}
  
];
*/



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule]
})
export class HistoryComponent {


  displayedColumns: string[] = ['Rental_id', 'Title', 'Shop','Payment', 'Amount', 'TotalDuration'];
  rentals: any;

  constructor(private apollo: Apollo, private _liveAnnouncer: LiveAnnouncer) { }

  /*@ViewChild(MatSort) sort: MatSort;*/


  ngOnInit(){
    this.updateAllRents(117);
  }

  updateAllRents(customer_id: number){
    this.apollo.query({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: customer_id}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.rentals = data.getRentalInfoByCustId;
      console.log(this.rentals);
    })
  }

  /*
  ngAfterViewInit() {
    this.rentals.sort = this.sort;
  }
  */

  /** Announce the change in sort state for assistive technology. */
  /*
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  */
}
