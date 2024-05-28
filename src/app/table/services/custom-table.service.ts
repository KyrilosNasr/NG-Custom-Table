import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicketDetails } from '../interfaces/ticket-details.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTableService {
  private dataPath = '../../../../assets/data/dummy-data.json';
  constructor(private http:HttpClient){

  }
  // setData(newData: any[]) {
  //   this.data = newData;
  // }

  getData():Observable<TicketDetails[]> {
    return this.http.get(this.dataPath) as Observable<TicketDetails[]>;
  }
}
