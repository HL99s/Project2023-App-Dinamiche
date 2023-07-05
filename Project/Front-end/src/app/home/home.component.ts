import {Component, OnInit, Inject} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import gql from 'graphql-tag';

const GET_USERNAME_BY_CUST_ID = gql`
query getUsernameByCustId($customerId : Int!) {
  getUsernameByCustId(customerId : $customerId){
    username
  }
}
`;

const cust_id = localStorage.getItem("ID");

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: any;
  constructor(private apollo:Apollo){ }
  ngOnInit(): void {
    this.apollo.query({
      query: GET_USERNAME_BY_CUST_ID,
      variables: {customerId: Number(cust_id)}
    }).subscribe(({data, loading})=>{
      //@ts-ignore
      this.username = data.getUsernameByCustId
    })
  }

}
