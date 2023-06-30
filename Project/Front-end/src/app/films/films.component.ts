import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {MatDialog} from '@angular/material/dialog';
import {InfoFilmComponent} from '../infoFilm/infoFilm.component';
import {RentalComponent} from '../rental/rental.component';


const FILMS_WITH_CATEGORY_QUERY = gql`
query getAllFilmsWithCategory($offset: Int!) {
  getAllFilmsWithCategory(offset: $offset, limit: 10) {
    film_id
    film_title
    release_year
    rating
    category,
    language,
    cost
  }
}
`;

const FILMS_BY_TITLE_QUERY = gql`
query getFilmsByTitle($offset: Int, $filmTitle: String){
  getFilmsByTitle(offset: $offset, limit: 10, filmTitle: $filmTitle){
    film_id
    film_title
    release_year
    rating
    category,
    language,
    cost
  }
}
`;

const FILMS_BY_CATEGORY_QUERY = gql`
query getFilmsByCategory($offset: Int, $categoryName: String!) {
  getFilmsByCategory(offset: $offset, limit: 10, categoryName: $categoryName) {
    film_id
    film_title
    release_year
    rating
    category,
    language,
    cost
  }
}
`;

const FILMS_BY_CATEGORY_AND_TITLE_QUERY = gql`
query getFilmsByCategoryAndTitle($offset: Int, $filmTitle: String, $categoryName: String!){
  getFilmsByCategoryAndTitle(offset: $offset, limit: 10, filmTitle: $filmTitle, categoryName: $categoryName){
    film_id
    film_title
    release_year
    rating
    category,
    language,
    cost
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

  searchByTitle: string = "";
  selectedCategoryOption: string = "All";

  filmCategory: any;

  constructor(private apollo: Apollo, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.updateAllFilms()
    this.updateCategory()
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

  updateAllFilms() {
    this.apollo.query({
      query: FILMS_WITH_CATEGORY_QUERY,
      variables: {offset: 10 * this.page}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getAllFilmsWithCategory;
      console.log(this.films);
    })
  }

  updateFilmsByTitle(filmTitle: string) {
    this.apollo.query({
      query: FILMS_BY_TITLE_QUERY,
      variables: {offset: 10 * this.page, filmTitle: filmTitle}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getFilmsByTitle;
      console.log(this.films);
    })
  }

  updateFilmsByCategory(category: string) {
    this.apollo.query({
      query: FILMS_BY_CATEGORY_QUERY,
      variables: {offset: 10 * this.page, categoryName: category}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getFilmsByCategory;
      console.log(this.films);
    })
  }

  updateFilmsByCategoryAndTitle(category: string, title: string) {
    this.apollo.query({
      query: FILMS_BY_CATEGORY_AND_TITLE_QUERY,
      variables: {offset: 10 * this.page, categoryName: category, filmTitle: title}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getFilmsByCategoryAndTitle;
      console.log(this.films);
    })
  }

  queryRouting() {
    if (this.selectedCategoryOption == "All") {
      if (this.searchByTitle != "") {
        this.updateFilmsByTitle(this.searchByTitle);
      } else {
        this.updateAllFilms();
      }
    } else {
      if (this.searchByTitle != "") {
        this.updateFilmsByCategoryAndTitle(this.selectedCategoryOption, this.searchByTitle);
      } else {
        this.updateFilmsByCategory(this.selectedCategoryOption);
      }
    }
  }

  nextPage() {
    if (this.films.length == 10) {
      this.page++;
      this.queryRouting();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.queryRouting();
    }
  }

  searchFilmByTitle(filmTitle: string) {
    this.page = 0;
    this.searchByTitle = filmTitle;
    this.queryRouting();
  }

  onCategoryChange() {
    this.page = 0;
    this.queryRouting();
  }

  openInfo(id: number) {
    this.dialog.open(InfoFilmComponent, {data: {film_id: id}})
  }

  openRental(id: number) {
    this.dialog.open(RentalComponent, {data: {film_id: id}})
  }

}
