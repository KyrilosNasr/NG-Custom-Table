import { TicketDetails } from "./ticket-details.interface";
export interface TableColumnDetails {
    name: string;
    rowDetail?:string;
    sortable?: boolean;
    draggable?: boolean;
  }

  export interface TableActionsDetails {
  id: number;
  actionType?:number;
  actionName: string;
  actionLogic: (row: TicketDetails | TicketDetails[]) => void;
}