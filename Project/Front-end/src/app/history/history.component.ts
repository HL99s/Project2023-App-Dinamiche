import {Component, AfterViewInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';



export interface History {
  
  Rental_id: number;
  Amount: number,
  Rental_Date: Date,
  Return_Date: Date,
  TotalDuration: Date

}
const ELEMENT_DATA: History[] = [
  {Rental_id: 10,
    Amount: 7.99,
    Rental_Date: new Date(2022,10,10),
    Return_Date: new Date(2022,10,20),
    TotalDuration: new Date(2022, 10, 10)},
  
];

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule],
})
export class HistoryComponent implements AfterViewInit {


  displayedColumns: string[] = ['Rental_id', 'Amount', 'Rental_Date', 'Return_Date', 'TotalDuration'];
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
