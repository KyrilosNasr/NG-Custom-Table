import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TicketDetails } from '../../interfaces/ticketDetails.interface';
import { TableCol } from '../../interfaces/table-col.interface';

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
  @Input() columns: TableCol[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cd: ChangeDetectorRef) {}

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      // Define default sortable columns
      const defaultSortable = true;

      // Define custom sortable settings for specific columns
      const customSortableSettings: { [key: string]: boolean } = {
        'Delivery Time': false
      };

      // Generate columns array
      this.columns = Object.keys(this.data[0]).map(key => ({
        name: key,
        sortable: customSortableSettings.hasOwnProperty(key) ? customSortableSettings[key] : defaultSortable
      }));

      this.cd.markForCheck();
    }
  }

  sortData(column: any) {
    if (!column.sortable) {
      return; // Do nothing if the column is not sortable
    }

    const columnName = column.name;
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const aValue = a[columnName];
      const bValue = b[columnName];

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  // Placeholder methods for row actions
  accept(ticket: TicketDetails) { 
    console.log(`You chose to accept ticket number: ${ticket["Ticket No"]}`);
    
  }
  reject(ticket: TicketDetails) { console.log(`You chose to reject ticket number: ${ticket["Ticket No"]}`); }
  edit(ticket: TicketDetails) { console.log(`You chose to edit ticket number: ${ticket["Ticket No"]}`); }
  delete(ticket: TicketDetails) { console.log(`You chose to delete ticket number: ${ticket["Ticket No"]}`); }
}
