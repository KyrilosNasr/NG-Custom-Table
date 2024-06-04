import { Component } from '@angular/core';
import { columns, ticketsList } from 'src/assets/data/dumy-data';
import { TicketDetails } from '../table/interfaces/ticket-details.interface';
import { PaginationConfig, TableConfig } from '../table/interfaces/table-details.interface';
import { TableActionsDetails, TableColumnDetails } from '../table/interfaces/table-details.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 
  tableConfigDetails:TableConfig ={
    data:ticketsList,
    paginationConfig:{rowsPerPage:3,currentPage:1},
    actionsKey:'stateId',
    actionsList:[
      {
        actionName: 'disable',
        actionType: 1,
        status:1,
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('Disabled', rowsList) : console.log('Disabled', row);
        }
      },
      {
        actionName: 'enable',
        actionType: 1,
        status:1,
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('Enabled', rowsList) : console.log('Enabled', row);
        }
      },
      {
        actionName:'accept',
        actionType:2,
        status:[1],
        actionLogic:(row:any,rowsList?:any) =>{
          rowsList?.length ? console.log('accept',rowsList): console.log('accept',row);
        }
      },
      {
        actionName: 'reject',
        actionType: 2,
        status:[1,2],
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('reject', rowsList) : console.log('reject', row);
        }
      },
      {
        actionName: 'delete',
        status:4,
        actionType: 2,
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('delete', rowsList) : console.log('delete', row);
  
        }
      },
      {
        actionName: 'view',
        actionType: 2,
        status:[1,2,3],
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('view', rowsList) : console.log('view', row);
  
        }
      },
      {
        actionName: 'edit',
        actionType: 2,
        status:[1,2],
        actionLogic: (row: any, rowsList?: any) => {
          rowsList?.length ? console.log('edit', rowsList) : console.log('edit', row);
  
        }
      }
    ],
    columns:columns
  };

}
