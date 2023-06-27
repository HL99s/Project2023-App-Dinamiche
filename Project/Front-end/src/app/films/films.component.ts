import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';






const SEARCH_FILMS_QUERY = gql`
query getFilm($offset: Int, $limit: Int, $filmTitle: String){
  getFilm(offset: $offset, limit: $limit, filmTitle: $filmTitle){
    film_id
    title
    description,
    name
  }
}
`;

const FILMS_QUERY = gql`
query getAllFilm($offset: Int!) {
  getAllFilm(offset: $offset, limit: 10) {
    film_id
    title
    description,
    name
  }
}
`;

const SEARCH_FILMS_CATEGORY_QUERY = gql`
query getFilmByCategory($offset: Int, $limit: Int, $filmTitle: String, $categoryName: String!){
  getFilm(offset: $offset, limit: $limit, filmTitle: $filmTitle, categoryName: $categoryName){
    film_id
    title
    description,
    name
  }
}
`;

const FILMS_CATEGORY_QUERY = gql`
query getAllFilmByCategory($offset: Int, $limit: Int, $categoryName: String!) {
  getAllFilm(offset: $offset, limit: 10, categoryName: $categoryName) {
    film_id
    title
    description,
    name
  }
}
`;

const CATEGORY_QUERY = gql`
  query getAllCategory($offset: Int!){
    getAllCategory(offset: $offset){
      category_id,
      category
    }
  }
`;

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})

export class FilmsComponent implements OnInit {
  page: number = 0;
  films: any;
  filmCategory: any;
  searchByTitle: String = "";
  filmsList: any[];
  selectedCategoryOption: any = "All";
  numberOfElements: number;
  



  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.updateAllFilms()
    this.updateCategory()
  }


  updateAllFilms() {

    if(this.selectedCategoryOption == "All"){
      console.log(`updateAllFilms ${this.page}`);
      this.apollo.query({
        query: FILMS_QUERY,
        variables: {offset: 10 * this.page}
      }).subscribe(({data, loading}) => {
        this.films = data;
        console.log(this.films);
        this.filmsList = this.films.getAllFilm; //quiiii
      })
    }else{
      console.log('TO DO: else updateAllFilms');
      this.apollo.query({
        query: FILMS_CATEGORY_QUERY,
        variables: {offset: 10 * this.page, filmCategory: this.selectedCategoryOption}
      }).subscribe(({data, loading}) => {
        this.films = data;
        this.filmsList = this.films.getAllFilm;
       
       
      })
    }
    
  }

  updateCategory(){
    this.apollo.query({
      query: CATEGORY_QUERY,
      variables: {offset: 0}
    }).subscribe(({data, loading}) => {
      this.filmCategory = data;
      this.filmCategory = this.filmCategory.getAllCategory;
      console.log(this.filmCategory);
    })
  }

  updateFilmsByTitle(filmTitle: String) {

    if(this.selectedCategoryOption == "All"){
      console.log(`updateFilmsByTitle ${this.page}`);
      this.apollo.query({
        query: SEARCH_FILMS_QUERY,
        variables: {offset: 10 * this.page, filmTitle: filmTitle}
      }).subscribe(({data, loading}) => {
        this.films = data;
        console.log(this.films);
        this.filmsList = this.films.getFilm;
      })
    }else{
      console.log('TO DO: else updateFilmsByTitle')
      this.apollo.query({
        query: SEARCH_FILMS_CATEGORY_QUERY,
        variables: {offset: 10 * this.page, filmTitle: filmTitle, filmCategory: this.selectedCategoryOption}
      }).subscribe(({data, loading}) => {
        this.films = data;
        this.filmsList = this.films.getAllFilm;
    
      })
    }

  }

  nextPage() {
    // TODO: fix: if you search f.ex. "a" you have only 10 row 
    
    //let numberOfElements = this.filmsList ? this.filmsList.length : 0;
    this.numberOfElements = this.films.getAllFilm.length;
    console.log(this.numberOfElements);
    if(this.numberOfElements >= 10) {
      this.page++;

      if (this.searchByTitle != "") {
        this.updateFilmsByTitle(this.searchByTitle);
      } else {
        this.updateAllFilms();
      }
    }
  }

  prevPage() {
    if (this.page > 0) this.page--;

    if (this.searchByTitle != "") {
      this.updateFilmsByTitle(this.searchByTitle);
    } else {
      this.updateAllFilms();
    }
  }

  searchByFilm(filmTitle: String) {
    this.page = 0;

    if(this.selectedCategoryOption == "All"){
      if (filmTitle != "") {
        this.searchByTitle = filmTitle;
        this.updateFilmsByTitle(filmTitle);
      } else {
        this.searchByTitle = "";
        this.updateAllFilms();
      }
    }else{
      //Se la categoria non è All
      console.log('TO DO : else di searchByFilm');
      if (filmTitle != "") {
        this.searchByTitle = filmTitle;
        this.updateFilmsByTitle(filmTitle); //qui
      } else {
        this.searchByTitle = "";
        this.updateAllFilms();  //qui
      }
    }
    
  }


  onCategoryChange(event: any){
    console.log(`Categoria: ${this.selectedCategoryOption}`)
  }


}
