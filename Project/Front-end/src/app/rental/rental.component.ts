import { Component, OnInit, Inject } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public arg: any){}
  ngOnInit(): void {
    this.apollo.query({
      query: FILM_BY_ID,
      variables: {id: this.arg.film_id}
    }).subscribe(({data, loading})=>{
      this.film = data
    })
  }

}
