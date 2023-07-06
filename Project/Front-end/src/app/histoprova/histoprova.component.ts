import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { InfoRentalComponent } from '../info-rental/info-rental.component';
import gql from 'graphql-tag';
import { map } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';




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
    store_id
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

  dispayedColumn: String[] = ['rental_id','film_title', 'payment_date', 'amount', 'shop','duration'];
  //dispayedColumn: String[] = ['rental_id','film_title', 'payment_date', 'amount', 'shop', 'rental_date', 'return_date','duration'];
  dataSource: MatTableDataSource<RentalData>;

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) pagination: MatPaginator

  rental_data: any;
  cust_id = localStorage.getItem("ID");
  constructor(private apollo: Apollo, public dialog: MatDialog){ }
  ngOnInit(): void {
    console.log(this.cust_id);
    this.apollo.query({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: Number(this.cust_id)}
    }).subscribe(({data, loading})=>{
      //@ts-ignore


      //this.rental_data = data.getRentalInfoByCustId
      this.rental_data = data.getRentalInfoByCustId.map((rental:{
        rental_date: string | number | Date; return_date: string | number | Date;
      })=>{
        const startDate: Date = new Date(rental.rental_date);
        const endDate: Date = new Date(rental.return_date);

        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

        // Creazione di una copia dell'oggetto rental con la proprietà duration aggiunta
        // i ... fanno una copia di rental
        return { ...rental, duration: differenceInMilliseconds };
      })
      this.dataSource = new MatTableDataSource(this.rental_data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination
      this.dataSource.filterPredicate = (data:
        RentalData, filterValue: string) =>
        data.film_title.trim().toLowerCase().indexOf(filterValue) !== -1;
    })

  }
  titleFilter(event: Event){
    const titleValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = titleValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  openInfo(rentalId: Number, shop: Number){
    console.log(shop)
    this.dialog.open(InfoRentalComponent, {data: {rental_id: rentalId, store_id: shop}})
  }

}















