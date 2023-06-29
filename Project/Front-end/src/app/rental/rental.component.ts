import { Component, OnInit, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';


import  gql  from 'graphql-tag';

const FILM_BY_ID = gql`
query getFilmById($id: Int){
  getFilmById(id: $id){
    film_title
    release_year
    description
    cost
  }
}
`;

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  film: any;
  res = false;

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any, public dialog: MatDialog){}
  ngOnInit(): void {
    this.apollo.query({
      query: FILM_BY_ID,
      variables: {id: this.arg.film_id}
    }).subscribe(({data, loading})=>{
      this.film = data
    })
  }

  openPopup(){
    this.dialog.open(AfterBuyDialog, {data:{result: this.res}})
  }

}

@Component({
  selector: 'after_buy',
  templateUrl: '../rentalConfirmPopUp/after_buy.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf],
})
export class AfterBuyDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
}

