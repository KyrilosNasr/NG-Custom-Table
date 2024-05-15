import { Component, OnInit } from '@angular/core';
import { TicketDetails } from '../table/interfaces/ticketDetails.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  ticketData!:TicketDetails[]
  tableHeaders: string[] = ['Ticket No', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Updated', 'Delivery Time', 'Ticket creator', 'job Number', 'Department', 'Whom'];

  constructor(private http: HttpClient){

  }
  ngOnInit(): void {
    this.getTableData()
  }
  getTableData(){
    this.http.get('assets/data/dummy-data.json')
    .subscribe((data) => {
      this.ticketData = data as TicketDetails[]});
  }
}
