import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';



/*const FILMS_QUERY = gql`
{
  query getAllFilm($offset: Int, $limit: Int){
    getAllFilm(offset: $offset, limit: $limit){
      film_id
      title
      description
    }
  }
}
`;*/

//To DO
const SEARCH_FILMS_QUERY = gql`
query getFilm($offset: Int, $limit: Int, $filmTitle: String){
  getFilm(offset: $offset, limit: $limit, filmTitle: $filmTitle){
    film_id
    title
    description
  }	
}
`;

const FILMS_QUERY = gql`
query getAllFilm($offset: Int, $limit: Int) {
  getAllFilm(offset: $offset, limit: $limit) {
    film_id
    title
    description
  }
}
`;

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})

export class FilmsComponent implements OnInit{
  page : number = 1;
  films: any;
  completeList: Boolean;
  ricercaVuota: Boolean = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {

    this.completeList= true;
    
    this.apollo.query({
        query: FILMS_QUERY,
        variables: {
          offset: 10 * this.page,
          //limit: 10
        }
    }).subscribe( ({data, loading}) => {
      this.films = data;
    } )
    /*this.query = this.apollo.watchQuery({
      query: FILMS_QUERY,
      variables: { offset: 10 * this.page }
    })*/

    /*.valueChanges.subscribe((result) => {
      // @ts-ignore
        this.films = result.data && result.data.films;
    });*/
  }

  /*
  update() {
    this.apollo.query({
      query: FILMS_QUERY,
      variables: { offset: 10 * this.page}
    }).subscribe( ({data, loading}) => {
      this.films = data;
      console.log(data)
    } )
  }
  */

  nextPage() {
    this.page++;
    this.update();
  }

  prevPage() {
    if (this.page > 0) this.page--;
    this.update();
  }


  searchByFilm(filmTitle: String){
    if(filmTitle != ""){
      this.completeList = false;
      this.apollo.query({
        query: SEARCH_FILMS_QUERY,
        variables: { offset: 10 * this.page, filmTitle: filmTitle}
      }).subscribe( ({data, loading}) => {
        this.films = data;
        console.log(data)
      } )
    }
    
    if(filmTitle == ""){
      this.ricercaVuota=true
      this.completeList=false
      this.update()
    }
    
  }
  
  



  





}
