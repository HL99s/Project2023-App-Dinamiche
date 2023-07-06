import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

const SIGN_IN_MUTATION = gql`
  mutation signIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
      username
      token
      customer_id
    }
  }
`;

interface SignInMutationResponse {
  signIn: {
    username: string;
    token: string;
    customer_id: number;
  }
}

/** @title Simple form field */
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule, NgIf],
})
export class LoginComponent {

  userName: string = "";
  password: string = "";
  wrongCredentials: boolean = false;
  nullCredentials: boolean = false;

  constructor(private authService: AuthService,
              private apollo: Apollo,
              private router: Router) {
  }

  onSubmit() {
    this.wrongCredentials = false;
    if (this.userName == "" || this.password == "") {
      this.nullCredentials = true;
    } else {
      this.nullCredentials = false;
      this.apollo
        .mutate<SignInMutationResponse>({
          mutation: SIGN_IN_MUTATION,
          variables: {username: this.userName, password: this.password}
        }).subscribe({
        next: (res) => {
          if (res.data?.signIn) {
            console.log(res.data);
            this.authService.saveUserData(res.data.signIn.customer_id, res.data.signIn.token, res.data.signIn.username);
            this.router.navigate(['/']);
          } else {
            this.wrongCredentials = true;
          }
        },
        error: (e) => {
          console.log("there was an error sending the query", e);
        }
      });
    }
  }
}
