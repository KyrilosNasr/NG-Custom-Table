import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { columns, ticketsList, userCols, users } from 'src/assets/data/dumy-data';
import { TicketDetails } from '../table/interfaces/ticket-details.interface';
import { PaginationConfig, TableConfig } from '../table/interfaces/table-details.interface';
import { TableActionsDetails, TableColumnDetails } from '../table/interfaces/table-details.interface';
import { UserService } from '../user-from/service/user.service';
import { User } from '../user-from/interfaces/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  
  dataList:any[] = [];
  tableConfigDetails:TableConfig ={
    data:users,
    paginationConfig:{rowsPerPage:3,currentPage:1},
    actionsKey:'maritalStatus',
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
    columns:userCols
  };
    constructor(private us:UserService){

    }

    ngOnInit(): void {
      this.us.users$.subscribe((data:User[])=>{
        this.dataList =data
        console.log(this.dataList);
        
      })
    }
}
