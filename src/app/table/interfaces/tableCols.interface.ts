import { TicketDetails } from "./ticketDetails.interface";

export interface TableColumnDetails {
    name: string;
    rowDetail?:string;
    sortable?: boolean;
    draggable?: boolean;
  }
  export interface TableAction {
    id:number;
    actionName: string;
    function: (selectedItems: TicketDetails[]) => void;
  }
  export interface RowActions {
    id:number;
    actionName:string;
    actionLogic:(data:any)=> void;
  }