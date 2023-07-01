import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Apollo} from "apollo-angular";
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

interface SignInMutationResponse {
  username: string;
  password: string;
  customer_id: number;
}

/** @title Simple form field */
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule],
})
export class LoginComponent {

  hide = true;
  userName: string;
  password: string;

  constructor(private authService: AuthService,
              private apollo: Apollo) {}

  onSubmit() {

    this.apollo
      .mutate<SignInMutationResponse>({
        mutation: SIGN_IN_MUTATION,
        variables: { username: this.userName, password: this.password}
      }).subscribe(
      ({ data }) => {
        // @ts-ignore
        const id = data.signIn.customer_id;
        console.log(id);
        const token = "tokenProva" //TODO: Add token generator and check if username+password are right
        this.authService.saveUserData(id, token);
        window.location.href = "/";
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }
}
