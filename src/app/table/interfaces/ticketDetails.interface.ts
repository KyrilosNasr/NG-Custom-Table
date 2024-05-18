export interface TicketDetail {
    value: string | number | Date;
    sortable: boolean;
  }
  export interface Ticket {
    ticketNo: TicketDetail;
    title: TicketDetail;
    category: TicketDetail;
    priority: TicketDetail;
    status: TicketDetail;
    date: TicketDetail;
    updated: TicketDetail;
    deliveryTime: TicketDetail;
    ticketCreator: TicketDetail;
    jobNumber: TicketDetail;
    department: TicketDetail;
    whom: TicketDetail;
  }
   export interface TicketList {
    ticketsList: Ticket[];
  }