import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "client";

  logged: boolean = false;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      this.logged = isAuthenticated;
    });
    this.authService.autoLogin();
  }

  logOut() {
    this.authService.logOut();
  }

  isNotLogged() {
    this.dialog.open(NotLogged);
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }
}

@Component({
  selector: 'notLogged',
  templateUrl: './notLoggedPopUp/notLogged.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})

export class NotLogged {
  constructor() {
  }
}
