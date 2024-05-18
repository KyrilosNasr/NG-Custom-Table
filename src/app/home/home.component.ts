import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ticketsList } from 'src/assets/data/dumy-data';
import { Ticket } from '../table/interfaces/ticketDetails.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  ticketData!:Ticket[]

  constructor(private http: HttpClient){

  }
  ngOnInit(): void {
    this.getTableData()
  }
  getTableData(){
    this.ticketData = ticketsList;
  }
}
