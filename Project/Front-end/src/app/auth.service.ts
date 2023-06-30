import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

const SIGN_IN_MUTATION = gql`
  mutation signIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
      username
      password
      customer_id
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private apollo: Apollo) {
    if (localStorage.getItem("token")) this.isAuthenticated.next(true);
    else this.isAuthenticated.next(false);
  }

  logIn(username: string, password: string) {
    this.apollo
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { username, password }
      }).subscribe(
        ({ data }) => {
          // @ts-ignore
          localStorage.setItem("token", username);
          this.isAuthenticated.next(true);
          window.location.href = "/";
        },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }
  logOut() {
    localStorage.removeItem("token");
    this.isAuthenticated.next(false);
    window.location.href = "/";
  }
}
