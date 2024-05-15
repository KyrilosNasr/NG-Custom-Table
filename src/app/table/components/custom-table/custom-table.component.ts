import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TicketDetails } from '../../interfaces/ticketDetails.interface';

// interface ColumnDefinition {
//   name: string;
//   type: string;
//   sortable?: boolean;
//   action?: (data: any) => void; 
// }

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges{
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
      this.cd.markForCheck();
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB, 'ar') 
          : valueB.localeCompare(valueA, 'ar');
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }

      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return this.sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }

      return 0; // Default fallback if the types do not match or are not handled
    });

    this.cd.markForCheck();
  }

  // Placeholder methods for row actions
  accept(ticket: TicketDetails) { 
    console.log(`You chose to accept ticket number: ${ticket["Ticket No"]}`);
    
  }
  reject(ticket: TicketDetails) { console.log(`You chose to reject ticket number: ${ticket["Ticket No"]}`); }
  edit(ticket: TicketDetails) { console.log(`You chose to edit ticket number: ${ticket["Ticket No"]}`); }
  delete(ticket: TicketDetails) { console.log(`You chose to delete ticket number: ${ticket["Ticket No"]}`); }
}
