import { publishFacade } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, ApolloModule } from 'apollo-angular';
import gql from 'graphql-tag';

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

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any){}
  ngOnInit(): void {
    console.log((this.arg.film_id))
    this.apollo.query({
      query: FILM_BY_ID,
      variables: {id: this.arg.film_id}
    }).subscribe(({data, loading})=>{
      this.film = data
    })

  }

}
