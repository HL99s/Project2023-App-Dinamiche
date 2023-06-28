import { publishFacade } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, ApolloModule } from 'apollo-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import gql from 'graphql-tag';
import { RentalComponent } from '../rental/rental.component';

const FILM_BY_ID = gql`
query getFilmById($id: Int){
  getFilmById(id: $id){
    film_title
    release_year
    description
  }
}
`;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit{

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
  openRental(){
    this.dialog.open(RentalComponent, {data: {film_id: this.arg.film_id}})
  }
}
