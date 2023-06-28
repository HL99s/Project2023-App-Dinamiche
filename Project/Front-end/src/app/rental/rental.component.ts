import { Component, OnInit, Inject } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


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
    this.dialog.open(AfterBuyDialog)
  }

}

@Component({
  selector: 'after_buy',
  templateUrl: '../html_popup/after_buy.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class AfterBuyDialog {}
