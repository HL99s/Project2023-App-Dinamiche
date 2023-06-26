import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

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
query getAllFilm($offset: Int!) {
  getAllFilm(offset: $offset, limit: 10) {
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

export class FilmsComponent implements OnInit {
  page: number = 0;
  rowcount: number;
  films: any;
  searchByTitle: String = "";

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.updateAllFilms()
  }

  updateAllFilms() {
    this.apollo.query({
      query: FILMS_QUERY,
      variables: {offset: 10 * this.page}
    }).subscribe(({data, loading}) => {
      this.films = data;
      this.rowcount = this.films.count;
    })
  }

  updateFilmsByTitle(filmTitle: String) {
    this.apollo.query({
      query: SEARCH_FILMS_QUERY,
      variables: {offset: 10 * this.page, filmTitle: filmTitle}
    }).subscribe(({data, loading}) => {
      this.films = data;
      this.rowcount = this.films.count;
    })
  }

  nextPage() {
    if(this.rowcount < 11) {
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
    if (filmTitle != "") {
      this.searchByTitle = filmTitle;
      this.updateFilmsByTitle(filmTitle);
    } else {
      this.searchByTitle = "";
      this.updateAllFilms();
    }
  }
}
