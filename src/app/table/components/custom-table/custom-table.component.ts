import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TicketCols } from '../../interfaces/ticketCols.interface';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges{
    @Input() data: any[] = [];
    columns: TicketCols[] = [];
    selectedTickets: any[] = [];
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';
  
    constructor(private cd: ChangeDetectorRef) {}
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes['data'] && this.data && this.data.length > 0) {
        // Define default sortable value
        const defaultSortable = true;
    
        // Generate columns array
        this.columns = Object.keys(this.data[0]).map(key => ({
          name: key,
          sortable: this.data[0][key]?.sortable ?? defaultSortable
        }));
    
        this.cd.markForCheck();
      }
    }
    
  
    sortData(column: TicketCols) {      
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
        const aValue = a[columnName].value;
        const bValue = b[columnName].value;
    
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
    accept(ticket: any) {
      console.log(`You chose to accept ticket number: ${ticket.ticketNo}`);
    }
    
    reject(ticket: any) {
      console.log(`You chose to reject ticket number: ${ticket.ticketNo}`);
    }
    
    edit(ticket: any) {
      console.log(`You chose to edit ticket number: ${ticket.ticketNo}`);
    }
    
    delete(ticket: any) {
      console.log(`You chose to delete ticket number: ${ticket.ticketNo}`);
    }
  
    selectAll(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        // If the select all checkbox is checked, select all tickets
        this.selectedTickets = [...this.data];
      } else {
        // Otherwise, handle selection as before
        target.indeterminate = false;
        this.selectedTickets = [];
      }
    }
  
    isSelected(ticket: any): boolean {
      return this.selectedTickets.some(selectedTicket => selectedTicket.ticketNo === ticket.ticketNo);
    }
  
    selectTicket(event: Event, ticket: any) {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        console.log(ticket);
        
        this.selectedTickets.push(ticket);
      } else {
        const index = this.selectedTickets.findIndex(selectedTicket => selectedTicket.ticketNo === ticket.ticketNo);
        if (index !== -1) {
          this.selectedTickets.splice(index, 1);
        }
      }
    }
  }
