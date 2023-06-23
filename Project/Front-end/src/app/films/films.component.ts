import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const FILMS_QUERY = gql`
{
  getAllFilm(offset: Int, limit: 10){
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
  page = 1;
  films: any[] = [];

  private query:  QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {

    // @ts-ignore
    this.query = this.apollo.watchQuery({
      query: FILMS_QUERY,
      variables: { offset: 10 * this.page }
    })

    .valueChanges.subscribe((result) => {
      // @ts-ignore
        this.films = result.data && result.data.films;
    });
  }

  update() {
    this.query.refetch({ offset: 10 * this.page });
  }

  nextPage() {
    this.page++;
    this.update();
  }

  prevPage() {
    if (this.page > 0) this.page--;
    this.update();
  }
}
