export interface TicketDetail {
    value: string | number | Date;
    sortable?: boolean;
    dragable?:boolean;
  }
  export interface Ticket {
    ticketNo: number;
    title: string;
    category: string;
    priority: string;
    status: string;
    date: Date;
    updated: Date;
    deliveryTime: Date;
    ticketCreator: string;
    jobNumber: number;
    department: string;
    whom: string;
  }
   export interface TicketList {
    ticketsList: Ticket[];
  }

  export interface TicketActions {
    actionName:string;
    actionLogic:(data:Ticket)=> void;
  }