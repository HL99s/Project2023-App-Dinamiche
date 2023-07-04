import { Component, OnInit } from '@angular/core';
import {AuthService} from "./auth/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "client";

  logged: boolean = false;
  constructor(private authService: AuthService) {
  }

  logOut() {
    this.authService.logOut();
  }
  ngOnInit() {
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });
    this.authService.autoLogin();
  }

}
