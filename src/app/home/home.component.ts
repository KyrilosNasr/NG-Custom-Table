import { Component } from '@angular/core';
import { columns, ticketsList } from 'src/assets/data/dumy-data';
import { TicketDetails } from '../table/interfaces/ticket-details.interface';
import { PaginationConfig } from '../table/interfaces/PaginationConfig.interface';
import { TableActionsDetails, TableColumnDetails } from '../table/interfaces/table-details.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  ticketData!:TicketDetails[]
  cols!:TableColumnDetails[]
  key ='stateId'
  tableConfig:PaginationConfig = {
    rowsPerPage: 3, currentPage: 1
  }
  actionsList:TableActionsDetails[]  = [
    {
      id:1,
      actionName:'disable',
      actionType:1,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('Disabled',rowsList): console.log('Disabled',row);
      }
    },
    {
      id:2,
      actionName:'enable',
      actionType:1,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('Enabled',rowsList): console.log('Enabled',row);
      }
    },
    {
      id:1,
      actionName:'accept',
      actionType:2,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('accept',rowsList): console.log('accept',row);
      }
    },
    {
      id:2,
      actionName:'reject',
      actionType:3,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('reject',rowsList): console.log('reject',row);
      }
    },
    {
      id:3,
      actionName:'delete',
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('delete',rowsList): console.log('delete',row);
        
      }
    },
    {
      id:4,
      actionName:'view',
      actionType:2,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('view',rowsList): console.log('view',row);
        
      }
    },
    {
      id:5,
      actionName:'edit',
      actionType:2,
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('edit',rowsList): console.log('edit',row);
        
      }
    }
  ]
  constructor(){
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
  }
}
