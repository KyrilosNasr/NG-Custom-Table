import { TableColumnDetails } from "src/app/table/interfaces/table-details.interface";
import { TicketDetails } from "src/app/table/interfaces/ticket-details.interface";
import { User } from "src/app/user-from/interfaces/user.interface";

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

export const users:User[] = [
  {
    "firstNameEn": "as",
    "secondNameEn": "as",
    "thirdNameEn": "as",
    "lastNameEn": "as",
    "firstNameAr": "da",
    "secondNameAr": "da",
    "thirdNameAr": "da",
    "lastNameAr": "da",
    "email": "a@a.co",
    "countryCode": "+20",
    "phoneNumber": 12323123,
    "dateOfBirth": '2 june 2024',
    "nationalId": 1234567,
    "maritalStatus": "Single",
    "gender": "Male",
    "addressEn": "asd",
    "addressAr": "asd"
}
]
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
export const userCols: TableColumnDetails[] =[
  { name: 'First Name (English)', rowDetail:'firstNameEn', sortable: false, draggable: true },
  { name: 'Second Name (English)',  rowDetail:'secondNameEn',sortable: true, draggable: true },
  { name: 'Third Name (English)',  rowDetail:'thirdNameEn',sortable: true, draggable: false },
  { name: 'Last Name (English)',  rowDetail:'lastNameEn',sortable: true, draggable: true },
  { name: 'First Name (Arabic)',  rowDetail:'firstNameAr',sortable: true, draggable: true },
  { name: 'Second Name (Arabic)', rowDetail:'secondNameAr', sortable: false, draggable: true },
  { name: 'Third Name (Arabic)', rowDetail:'thirdNameAr', sortable: false, draggable: false },
  { name: 'Last Name (Arabic)',  rowDetail:'lastNameAr', sortable: false, draggable: false },
  { name: 'Email',  rowDetail:'email',sortable: false, draggable: false },
  { name: 'Country Code',  rowDetail:'countryCode',sortable: true, draggable: true },
  { name: 'Phone Number',  rowDetail:'phoneNumber',sortable: true, draggable: true },
  { name: 'Date of Birth',  rowDetail:'dateOfBirth',sortable: true, draggable: true },
  { name: 'National ID',  rowDetail:'nationalId',sortable: true, draggable: true },
  { name: 'Marital Status',  rowDetail:'maritalStatus',sortable: true, draggable: true },
  { name: 'Gender',  rowDetail:'gender',sortable: true, draggable: true },
  { name: 'Address (English)',  rowDetail:'addressEn',sortable: true, draggable: true },
  { name: 'Address (Arabic)',  rowDetail:'addressAr',sortable: true, draggable: true },
];
