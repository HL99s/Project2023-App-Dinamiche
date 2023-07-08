import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
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

  screenWidth: number;
  //screenHeigth: number; 

  title: string = "client";

  logged: boolean = false;

  window: any;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      this.logged = isAuthenticated;
    });
    this.authService.autoLogin();
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth);

    window.onresize = () => this.screenSizeOnChanges();
  }

  
  screenSizeOnChanges(){
    
    

    if(window.innerWidth < 768 && this.screenWidth > 768){
      this.screenWidth = window.innerWidth;
      console.log(this.screenWidth);
      location.reload();
    }
    
    if(window.innerWidth >= 768 && this.screenWidth <= 768){
      this.screenWidth = window.innerWidth;
      console.log(this.screenWidth);
      location.reload();
    }

    
    
    
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
  templateUrl: './notLoggedPopUp/notLoggedPopUp.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})

export class NotLogged {
  constructor() {
  }
}


