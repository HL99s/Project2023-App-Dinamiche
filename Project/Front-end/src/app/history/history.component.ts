import {Component, AfterViewInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';




export interface History {
  
  Rental_id: number;
  Title: string,
  Shop: string,
  Amount: number,
  TotalDuration: number //numero di millisecondi
 

}

//Dati Fasulli
const ELEMENT_DATA: History[] = [
  { Rental_id: 10,
    Title: "Cat is Angry!!",
    Shop: "BorgoRoma Shop :->",
    Amount: 100.99,
    TotalDuration: 86400000},

    { Rental_id: 10,
      Title: "Cat is Happy!!",
      Shop: "PoloZanotto Shop :->",
      Amount: -88,
      TotalDuration: 899400877}
  
];

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule]
})
export class HistoryComponent implements AfterViewInit {


  displayedColumns: string[] = ['Rental_id', 'Title', 'Shop', 'Amount', 'TotalDuration'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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
