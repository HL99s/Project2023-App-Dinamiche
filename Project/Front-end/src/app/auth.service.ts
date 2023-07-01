import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { Apollo } from "apollo-angular";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: string = "";

  _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  constructor(private apollo: Apollo) {
    /*if (localStorage.getItem("token")) this._isAuthenticated.next(true);
    else this._isAuthenticated.next(false);*/
  }

  saveUserData(id: number, token: string) {

    localStorage.setItem("ID", String(id));
    localStorage.setItem("TOKEN", token);
    this.setUserId(String(id));
  }

  setUserId(id: string) {
    this.userId = id;

    this._isAuthenticated.next(true);
  }

  /*logIn(username: string, password: string) {
    this.apollo
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { username, password }
      }).subscribe(
        ({ data }) => {
          // @ts-ignore
          localStorage.setItem("token", username);
          this._isAuthenticated.next(true);
          window.location.href = "/";
        },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }*/

  logOut() {
    localStorage.removeItem("ID");
    localStorage.removeItem("TOKEN");
    this.userId = "";
    this._isAuthenticated.next(false);
    window.location.href = "/";
  }

  autoLogin() {
    const id = localStorage.getItem("ID");
    if (id) {
      this.setUserId(id);
    }
  }
}
