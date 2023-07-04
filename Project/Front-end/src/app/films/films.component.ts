import {Component, OnInit, ViewChild} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {MatDialog} from '@angular/material/dialog';
import { MatTable} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {InfoFilmComponent} from '../infoFilm/infoFilm.component';
import {RentalComponent} from '../rental/rental.component';



export interface FilmData{
  film_id: Number,
  film_title: String,
  release_year: Number,
  rating: String,
  category: String,
  language: String,
  cost: Number
}


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
query getFilmsByTitle($filmTitle: String){
  getFilmsByTitle(filmTitle: $filmTitle){
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
query getFilmsByCategory($categoryName: String!) {
  getFilmsByCategory(categoryName: $categoryName) {
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
query getFilmsByCategoryAndTitle($filmTitle: String, $categoryName: String!){
  getFilmsByCategoryAndTitle(filmTitle: $filmTitle, categoryName: $categoryName){
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

const ALL_FILM_QUERY = gql`
query getAllFilm{
  getAllFilm{
    film_id
    film_title
    release_year
    rating
    category
    language
    cost
  }
}
`;



@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})

export class FilmsComponent implements OnInit {
  films: any;
  displayedColumn: String[] = ['film_title', 'release_year', 'rating', 'category', 'language', 'cost', 'rental'];
  dataSource: MatTableDataSource<FilmData>

  searchByTitle: string = "";
  selectedCategoryOption: string = "All";

  filmCategory: any;

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) pagination: MatPaginator


  constructor(private apollo: Apollo, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.updateAllFilms()
    this.updateCategory()

  }

  openInfo(filmId: number) {
    this.dialog.open(InfoFilmComponent, {data: {film_id: filmId}})
  }

  openRental(filmId: number) {
    this.dialog.open(RentalComponent, {data: {film_id: filmId}})
  }

  updateCategory() {
    this.apollo.query({
      query: CATEGORY_QUERY,
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.filmCategory = data.getAllCategories;

    })
  }

  updateAllFilms() {
    this.apollo.query({
      query: ALL_FILM_QUERY,
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getAllFilm;
      this.dataSource = new MatTableDataSource(this.films);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination;
      this.dataSource.paginator.pageIndex = 0
      this.dataSource.filterPredicate = (data:
        FilmData, filterValue: string) =>
        data.film_title.trim().toLowerCase().indexOf(filterValue) != -1;
      console.log(this.films)
    })
  }

  updateFilmsByTitle(filmTitle: string) {
    this.apollo.query({
      query: FILMS_BY_TITLE_QUERY,
      variables: {filmTitle: filmTitle}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getFilmsByTitle;
      this.dataSource = new MatTableDataSource(this.films);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination;
      this.dataSource.paginator.pageIndex = 0;
      console.log(this.films)
    })
  }

  updateFilmsByCategory(category: string) {
    this.apollo.query({
      query: FILMS_BY_CATEGORY_QUERY,
      variables: {categoryName: category}
    }).subscribe(({data, loading}) => {
      // @ts-ignore
      this.films = data.getFilmsByCategory;
      this.dataSource = new MatTableDataSource(this.films);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.pagination;
      this.dataSource.paginator.pageIndex = 0
      console.log(this.films)
    })
  }

  updateFilmsByCategoryAndTitle(category: string, title: string) {
    this.apollo.query({
      query: FILMS_BY_CATEGORY_AND_TITLE_QUERY,
      variables: {categoryName: category}
    }).subscribe(({data, loading}) => {

      // @ts-ignore
      this.films = data.getFilmsByCategoryAndTitle;
      this.dataSource = new MatTableDataSource(this.films);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.pagination;
      this.dataSource.paginator.pageIndex = 0;
      this.dataSource.filterPredicate = (data:
        FilmData, filterValue: string) =>
        data.film_title.trim().toLowerCase().indexOf(filterValue) !== -1;
      console.log("All",this.films)

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
  /*
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
  */
  searchFilmByTitle(filmTitle: string) {
    //this.page = 0;
    this.searchByTitle = filmTitle;
    this.queryRouting();
  }

  onCategoryChange() {
    //this.page = 0;
    this.queryRouting();
  }

  titleFilter(event: Event){
    const titleValue = (event.target as HTMLInputElement).value;
    let filterValue: any;
    filterValue = titleValue.trim(); // Remove whitespace
    console.log("DDDD", filterValue)
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.searchByTitle = filterValue;

  }


}
