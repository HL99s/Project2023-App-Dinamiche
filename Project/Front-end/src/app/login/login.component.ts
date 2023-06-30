import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";

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

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log(this.userName);
    console.log(this.password);
    this.authService.logIn(this.userName, this.password);
  }
}
