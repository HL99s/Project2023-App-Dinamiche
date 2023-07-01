import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export interface RentalData{
  rental_id: number,
  film_title: String,
  payment_date: Date,
  amount: number,
  shop: String,
  rental_date: Date,
  return_date: Date
}

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

@Component({
  selector: 'app-histoprova',
  templateUrl: './histoprova.component.html',
  styleUrls: ['./histoprova.component.css']
})
export class HistoprovaComponent implements OnInit{
  dispayedColumn: String[] = ['rental_id','film_title', 'payment_date', 'amount', 'shop', 'rental_date', 'return_date'];
  dataSource: MatTableDataSource<RentalData>;

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) pagination: MatPaginator

  rental_data: any;

  constructor(private apollo: Apollo){ }
  ngOnInit(): void {
    this.apollo.query({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: 367}
    }).subscribe(({data, loading})=>{
      //@ts-ignore
      this.rental_data = data.getRentalInfoByCustId
      this.dataSource = new MatTableDataSource(this.rental_data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination
    })

  }
  titleFilter(event: Event){
    const titleValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = titleValue.trim().toLowerCase()

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

}
