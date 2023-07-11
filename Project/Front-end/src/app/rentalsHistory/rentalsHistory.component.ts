import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Apollo} from 'apollo-angular';
import {MatDialog} from '@angular/material/dialog';
import {Rental_infoComponent} from '../rental_info/rental_info.component';
import gql from 'graphql-tag';

export interface RentalData {
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

interface getRentalInfoByCustIdResponse {
  getRentalInfoByCustId: {
    rental_id: number,
    film_title: string,
    payment_date: Date,
    amount: number,
    store_id: number,
    shop: string,
    rental_date: Date,
    return_date: Date
  }
}

@Component({
  selector: 'app-histoprova',
  templateUrl: './rentalsHistory.component.html',
  styleUrls: ['./rentalsHistory.component.css']
})
export class RentalsHistoryComponent implements OnInit {

  dispayedColumn: String[] = ['rental_id', 'film_title', 'payment_date', 'amount', 'shop', 'duration'];
  dataSource: MatTableDataSource<RentalData>;
  //
  ordineSelezionato: string = 'film_title';
  isOrderAsc: boolean = true;

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) pagination: MatPaginator

  rental_data: any;
  cust_id = localStorage.getItem("ID");

  constructor(private apollo: Apollo, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apollo.query<getRentalInfoByCustIdResponse>({
      query: RENTALS_BY_ID_QUERY,
      variables: {customerId: Number(this.cust_id)}
    }).subscribe(({data, loading}) => {

      this.rental_data = data.getRentalInfoByCustId
      this.rental_data = this.rental_data.map((rental: {
        rental_date: string | number | Date; return_date: string | number | Date;
      }) => {
        const startDate: Date = new Date(rental.rental_date);
        const endDate: Date = new Date(rental.return_date);

        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

        // Creazione di una copia dell'oggetto rental con la proprietà duration aggiunta
        // i ... fanno una copia di rental
        return {...rental, duration: differenceInMilliseconds};
      })
      this.dataSource = new MatTableDataSource(this.rental_data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination
      this.dataSource.filterPredicate = (data:
                                           RentalData, filterValue: string) =>
        data.film_title.trim().toLowerCase().indexOf(filterValue) !== -1;
    })

  }

  titleFilter(event: Event) {
    const titleValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = titleValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  openInfo(rentalId: Number, shop: Number) {
    this.dialog.open(Rental_infoComponent, {data: {rental_id: rentalId, store_id: shop}})
  }

  onOrdinaClick() {

    if (this.ordineSelezionato) {

      this.dataSource.sort = this.sort;
      this.dataSource.sort.active = this.ordineSelezionato;

      if (this.isOrderAsc) {
        this.dataSource.sort.direction = 'asc';
      } else {
        this.dataSource.sort.direction = 'desc';
      }

      this.dataSource.sort.sortChange.emit();
      //console.log(this.ordineSelezionato);
      //console.log(this.isOrderAsc);
    }
  }

}
