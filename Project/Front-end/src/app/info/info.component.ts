import { publishFacade } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, ApolloModule } from 'apollo-angular';
import gql from 'graphql-tag';

const FILM_ID = gql`
query getFilmById($film_id: Int){
  getFilmById(film_id: $film_id){
    film_id
    title
    description
    release_year
  }
}
`;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit{

  constructor(private apollo: Apollo, @Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit(): void {

  }

}
