import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {MatDialog} from '@angular/material/dialog';
import {Film_infoComponent} from '../film_info/film_info.component';
import {RentalComponent} from '../rental/rental.component';



const FILMS_WITH_CATEGORY_QUERY = gql`
  query getAllFilmsWithCategory($offset: Int!) {
    getAllFilmsWithCategory(offset: $offset, limit: 11) {
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
    getFilmsByTitle(offset: $offset, limit: 11, filmTitle: $filmTitle){
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
    getFilmsByCategory(offset: $offset, limit: 11, categoryName: $categoryName) {
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
    getFilmsByCategoryAndTitle(offset: $offset, limit: 11, filmTitle: $filmTitle, categoryName: $categoryName){
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

interface getAllFilmsWithCategoryResponse{
  getAllFilmsWithCategory: {
    film_id: number,
    film_title: string,
    release_year: number,
    rating: string,
    category: string,
    language: string,
    cost: number
  }
}

interface getFilmsByTitleResponse{
  getFilmsByTitle: {
    film_id: number,
    film_title: string,
    release_year: number,
    rating: string,
    category: string,
    language: string,
    cost: number
  }
}

interface getFilmsByCategoryResponse{
  getFilmsByCategory: {
    film_id: number,
    film_title: string,
    release_year: number,
    rating: string,
    category: string,
    language: string,
    cost: number
  }
}

interface getFilmsByCategoryAndTitleResponse{
  getFilmsByCategoryAndTitle: {
    film_id: number,
    film_title: string,
    release_year: number,
    rating: string,
    category: string,
    language: string,
    cost: number
  }
}

interface getAllCategoriesResponse{
  getAllCategories: {
    category_id: number,
    category: string
  }
}





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
  pending: boolean = false;

  constructor(private apollo: Apollo, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.updateAllFilms()
    this.updateCategory()
  }

  updateCategory() {
    this.apollo.query<getAllCategoriesResponse>({
      query: CATEGORY_QUERY,
    }).subscribe(({data, loading}) => {

      this.filmCategory = data.getAllCategories;
      console.log(this.filmCategory);
    })
  }

  updateAllFilms() {
    this.apollo.query<getAllFilmsWithCategoryResponse>({
      query: FILMS_WITH_CATEGORY_QUERY,
      variables: {offset: 10 * this.page}
    }).subscribe(({data, loading}) => {

      this.films = data.getAllFilmsWithCategory;
      console.log(this.films);
    })
  }

  updateFilmsByTitle(filmTitle: string) {
    console.log("filter: ", filmTitle)
    this.apollo.query<getFilmsByTitleResponse>({
      query: FILMS_BY_TITLE_QUERY,
      variables: {offset: 10 * this.page, filmTitle: filmTitle}
    }).subscribe(({data, loading}) => {

      this.films = data.getFilmsByTitle;
      console.log(this.films);
    })
  }

  updateFilmsByCategory(category: string) {
    this.apollo.query<getFilmsByCategoryResponse>({
      query: FILMS_BY_CATEGORY_QUERY,
      variables: {offset: 10 * this.page, categoryName: category}
    }).subscribe(({data, loading}) => {

      this.films = data.getFilmsByCategory;
      console.log(this.films);
    })
  }

  updateFilmsByCategoryAndTitle(category: string, title: string) {
    this.apollo.query<getFilmsByCategoryAndTitleResponse>({
      query: FILMS_BY_CATEGORY_AND_TITLE_QUERY,
      variables: {offset: 10 * this.page, categoryName: category, filmTitle: title}
    }).subscribe(({data, loading}) => {

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
    if (this.films.length == 11) {
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

  searchFilmByTitle(event: Event) {
    this.searchByTitle = (<HTMLInputElement>event.target).value;

    if (!this.pending) {
      this.pending = true;
      this.page = 0;

      setTimeout(() => {
        this.queryRouting();
        this.pending = false;

        if (this.searchByTitle != (<HTMLInputElement>event.target).value) {
          this.queryRouting();
        }

      }, 500);

    }
  }

  onCategoryChange() {
    this.page = 0;
    this.queryRouting();
  }

  openInfo(id: number) {
    this.dialog.open(Film_infoComponent, {data: {film_id: id}})
  }

  openRental(id: number) {
    this.dialog.open(RentalComponent, {data: {film_id: id}})
  }

}
