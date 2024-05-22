import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { columns, ticketsList } from 'src/assets/data/dumy-data';
import { Ticket, TicketActions } from '../table/interfaces/ticketDetails.interface';
import { PaginationConfig } from '../table/interfaces/PaginationConfig.interface';
import { TicketCols } from '../table/interfaces/ticketCols.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  ticketData!:Ticket[]
  cols!:TicketCols[]
  tableConfig:PaginationConfig = {
    rowsPerPage: 2, currentPage: 1
  }
  actionsSource = 'allowedActions';
  actions: TicketActions[] = [
    {
      actionName:'accept',
      actionLogic:(ticket:Ticket) =>{
        console.log('accept',ticket);
        
      }
    },
    {
      actionName:'reject',
      actionLogic:(ticket:Ticket) =>{
        console.log('reject',ticket);
        
      }
    },
    {
      actionName:'delete',
      actionLogic:(ticket:Ticket) =>{
        console.log('delete',ticket);
        
      }
    },
    {
      actionName:'view',
      actionLogic:(ticket:Ticket) =>{
        console.log('view',ticket);
        
      }
    }
    // Define your actions here
  ];
  constructor(private http: HttpClient){
  }
  ngOnInit(): void {
    this.getTableData();
    this.getTableCols()
  }
  getTableData(){
    this.ticketData = ticketsList;
  }
  getTableCols(){
    this.cols = columns;
    console.log(this.cols);
    
  }
}
