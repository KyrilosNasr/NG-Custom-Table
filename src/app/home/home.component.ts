import { Component } from '@angular/core';
import { columns, ticketsList } from 'src/assets/data/dumy-data';
import { TicketDetails } from '../table/interfaces/ticketDetails.interface';
import { PaginationConfig } from '../table/interfaces/PaginationConfig.interface';
import { RowActions, TableAction, TableColumnDetails } from '../table/interfaces/tableCols.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  ticketData!:TicketDetails[]
  cols!:TableColumnDetails[]
  tableConfig:PaginationConfig = {
    rowsPerPage: 3, currentPage: 1
  }
  actionsSource = 'allowedActions';
  colActionsList:TableAction[]=[
    {
      id:1,
      actionName:'disable',
      function:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('Disabled',rowsList): console.log('Disabled',row);
      }
    },
    {
      id:2,
      actionName:'enable',
      function:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('Enabled',rowsList): console.log('Enabled',row);
      }
    },
  ];
  
  rowActionsList: RowActions[] = [
    {
      id:1,
      actionName:'accept',
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('accept',rowsList): console.log('accept',row);
      }
    },
    {
      id:2,
      actionName:'delete',
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
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('view',rowsList): console.log('view',row);
        
      }
    },
    {
      id:5,
      actionName:'edit',
      actionLogic:(row:any,rowsList?:any) =>{
        rowsList?.length ? console.log('edit',rowsList): console.log('edit',row);
        
      }
    }
  ];
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
