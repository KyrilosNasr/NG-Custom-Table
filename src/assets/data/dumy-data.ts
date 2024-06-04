import { TableColumnDetails } from "src/app/table/interfaces/table-details.interface";
import { TicketDetails } from "src/app/table/interfaces/ticket-details.interface";

export let ticketsList: TicketDetails[] = [
  {
    ticketNo: 9191,
    title: 'منتم',
    category: 'Air',
    priority: 'Normal',
    status: 'pending',
    date: new Date('2023-12-17'),
    updated: new Date('2024-04-30'),
    deliveryTime: new Date('1970-01-01T00:05:00'),
    ticketCreator: 'Mai abd ellatif',
    jobNumber: 7007777,
    department: 'Technical',
    whom: 'Mai abd ellatif',
    stateId:1
  },
  {
    ticketNo: 1010502,
    title: "بلاغ اطلب",
    category: "cleaning",
    priority: "Normal",
    status: "Pending",
    date: new Date("2024-04-26"),
    updated: new Date("2024-05-11"),
    deliveryTime: new Date('1970-01-01T13:00:00'),
    ticketCreator: "مراجع 2222",
    jobNumber: 7007777,
    department: "Technical",
    whom: "Stock",
    stateId:2
  },
  {
    ticketNo: 9190,
    title: "منتم",
    category: "Air",
    priority: "Normal",
    status: "Closed",
    date: new Date('2023-12-17'),
    updated: new Date('2024-04-30'),
    deliveryTime: new Date('1970-01-01T00:05:00'),
    ticketCreator: "Mai abd ellatif",
    jobNumber: 7007777,
    department: "Technical",
    whom: "Mai abd ellatif",
    stateId:3
  },
  {
    ticketNo: 17553,
    title: "بلاغ (طلب",
    category: "cleaning",
    priority: "Normal",
    status: "In Progress",
    date: new Date("2024-04-18"),
    updated: new Date("2024-04-24"),
    deliveryTime: new Date('1970-01-01T00:00:00'),
    ticketCreator: "Mai abd ellatif",
    jobNumber: 7007777,
    department: "Technical",
    whom: "Mai abd ellatif",
    stateId:4
  },
  {
    ticketNo: 17568,
    title: "(بلاغ ( بناء",
    category: "Electronics",
    priority: "Normal",
    status: "In Progress",
    date: new Date("2024-04-21"),
    updated: new Date("2024-04-22"),
    deliveryTime: new Date('1970-01-01T00:00:00'),
    ticketCreator: "Hussein Ali",
    jobNumber: 3003333,
    department: "Technical",
    whom: "Mai abd ellatif",
    stateId:1
  }
];

export const columns: TableColumnDetails[] =[
  { name: 'Number', rowDetail:'ticketNo', sortable: false, draggable: true },
  { name: 'title',  rowDetail:'title',sortable: true, draggable: true },
  { name: 'category',  rowDetail:'category',sortable: true, draggable: false },
  { name: 'priority',  rowDetail:'priority',sortable: true, draggable: true },
  { name: 'status',  rowDetail:'status',sortable: true, draggable: true },
  { name: 'date', rowDetail:'date', sortable: false, draggable: true },
  { name: 'updated', rowDetail:'updated', sortable: false, draggable: false },
  { name: 'deliveryTime',  rowDetail:'deliveryTime', sortable: false, draggable: false },
  { name: 'ticketCreator',  rowDetail:'ticketCreator',sortable: false, draggable: false },
  { name: 'jobNumber',  rowDetail:'jobNumber',sortable: true, draggable: true },
  { name: 'department',  rowDetail:'department',sortable: true, draggable: true },
  { name: 'whom',  rowDetail:'whom',sortable: true, draggable: true },
];
