import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';


const FILMS_WITH_CATEGORY_QUERY = gql`
query getAllFilmsWithCategory($offset: Int!) {
  getAllFilmsWithCategory(offset: $offset, limit: 10) {
    film_id
    title
    description,
    name
  }
}
`;

const FILMS_BY_TITLE_QUERY = gql`
query getFilmsByTitle($offset: Int, $filmTitle: String){
  getFilmsByTitle(offset: $offset, limit: 10, filmTitle: $filmTitle){
    film_id
    title
    description,
    name
  }
}
`;

const FILMS_BY_CATEGORY_QUERY = gql`
query getFilmsByCategory($offset: Int, $categoryName: String!) {
  getFilmsByCategory(offset: $offset, limit: 10, categoryName: $categoryName) {
    film_id
    title
    description,
    name
  }
}
`;

const FILMS_BY_CATEGORY_AND_TITLE_QUERY = gql`
query getFilmByCategoryAndTitle($offset: Int, $filmTitle: String, $categoryName: String!){
  getFilmByCategoryAndTitle(offset: $offset, limit: 10, filmTitle: $filmTitle, categoryName: $categoryName){
    film_id
    title
    description,
    name
  }
}
`;

const CATEGORY_QUERY = gql`
  query getAllCategories{
    getAllCategories{
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
  numberOfElements: number;

  searchByTitle: String = "";
  selectedCategoryOption: any = "All";

  filmCategory: any;

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.updateAllFilms()
    this.updateCategory()
  }

  updateAllFilms() {

    if (this.selectedCategoryOption == "All") {
      console.log(`updateAllFilms ${this.page}`);
      this.apollo.query({
        query: FILMS_WITH_CATEGORY_QUERY,
        variables: {offset: 10 * this.page}
      }).subscribe(({data, loading}) => {
        // @ts-ignore
        this.films = data.getAllFilmsWithCategory;
        console.log(this.films);
      })
    } else {
      console.log('TO DO: else updateAllFilms');
      this.apollo.query({
        query: FILMS_BY_CATEGORY_QUERY,
        variables: {offset: 10 * this.page, filmCategory: this.selectedCategoryOption}
      }).subscribe(({data, loading}) => {
        // @ts-ignore
        this.films = data.getFilmsByCategory;
      })
    }

  }

  updateCategory() {
    this.apollo.query({
      query: CATEGORY_QUERY,
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.filmCategory = data.getAllCategories;
      console.log(this.filmCategory);
    })
  }

  updateFilmsByTitle(filmTitle: String) {

    if (this.selectedCategoryOption == "All") {
      console.log(`updateFilmsByTitle ${this.page}`);
      this.apollo.query({
        query: FILMS_BY_TITLE_QUERY,
        variables: {offset: 10 * this.page, filmTitle: filmTitle}
      }).subscribe(({data, loading}) => {
        // @ts-ignore
        this.films = data.getFilmsByTitle;
        console.log(this.films);
      })
    } else {
      console.log('TO DO: else updateFilmsByTitle')
      this.apollo.query({
        query: FILMS_BY_CATEGORY_AND_TITLE_QUERY,
        variables: {offset: 10 * this.page, filmTitle: filmTitle, filmCategory: this.selectedCategoryOption}
      }).subscribe(({data, loading}) => {
        // @ts-ignore
        this.films = data.getFilmByCategoryAndTitle;
      })
    }
  }

  nextPage() {
    this.numberOfElements = this.films.length;
    if (this.numberOfElements == 10) {
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

    if (this.selectedCategoryOption == "All") {
      if (filmTitle != "") {
        this.searchByTitle = filmTitle;
        this.updateFilmsByTitle(filmTitle);
      } else {
        this.searchByTitle = "";
        this.updateAllFilms();
      }
    } else {
      //Se la categoria non è All
      console.log('TO DO : else di searchByFilm');
      if (filmTitle != "") {
        this.searchByTitle = filmTitle;
        this.updateFilmsByTitle(filmTitle);
      } else {
        this.searchByTitle = "";
        this.updateAllFilms();
      }
    }
  }

  onCategoryChange(event: any) {
    console.log(`Categoria: ${this.selectedCategoryOption}`)
  }

}
