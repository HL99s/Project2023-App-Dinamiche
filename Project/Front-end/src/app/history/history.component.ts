import {Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

//const username = localStorage.getItem("token");

const RENTALS_BY_ID_QUERY = gql`
query getRentalInfoByCustId($customerId : Int!) {
  getRentalInfoByCustId(customerId : $customerId){
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



export interface Rental_Info {
  rental_id: number
  film_title: string,
  payment_date: string,
  amount: number,
  shop: string,
  rental_date: string,
  return_date: string
}

export interface Rensponse{
  rental_info: Rental_Info[]
}




@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule]
})
export class HistoryComponent implements OnInit{


  displayedColumns: string[] = ['rental_id', 'film_title', 'payment_date', 'amount', 'shop','rental_date','return_date'];
  rentals: any;
  RENTAL_DATA: Rental_Info[];
  dataSource: MatTableDataSource<Rental_Info>;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private apollo: Apollo, private _liveAnnouncer: LiveAnnouncer) { }




  ngOnInit(){

    this.updateAllRents(117);
  }


  updateAllRents(customer_id: number){
    this.apollo.query({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: customer_id}
    }).subscribe(({data, loading}) => {


      //@ts-ignore
      console.log(typeof(Object.values(data.getRentalInfoByCustId)));
      /*
      this.RENTAL_DATA = new MatTableDataSource(data.getRentalInfoByCustId);
      this.RENTAL_DATA.sort = this.sort;
      console.log(this.RENTAL_DATA);
      */
    })
  }

  //Non funzionante
  /*
  updateAllRents(customer_id: number){
    this.apollo.watchQuery<Rensponse>({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: customer_id}
    }).valueChanges.pipe(map(result=>result.data.rental_info)).subscribe(
      (result: Rental_Info[])=>this.dataSource=new MatTableDataSource(result));
    console.log(this.dataSource);
  }
  */




  //Non funzionante
  /*
  ngAfterViewInit() {
    //@ts-ignore
    this.dataSource.sort = this.sort;
  }
  */

  /** Announce the change in sort state for assistive technology. */
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
}
