  export interface TicketDetails {
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
    allowedActions?:number[]
  }