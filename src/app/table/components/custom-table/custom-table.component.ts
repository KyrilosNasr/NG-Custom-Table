import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TicketCols } from '../../interfaces/ticketCols.interface';
import { PaginationConfig } from '../../interfaces/PaginationConfig.interface';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges{
  @Input() data: any[] = [];
  @Input() paginationConfig: PaginationConfig = { rowsPerPage: 5, currentPage: 1 }; // Receive pagination config from parent
  columns: TicketCols[] = [];
  selectedTickets: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  paginatedData: any[] = [];
  totalPages: number = 0;
  rowsPerPageOptions: number[] = [2, 3, 4, 5];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.generateColumns();
      this.updatePagination();
      this.cd.markForCheck();
    }
  }

  generateColumns() {
    this.columns = Object.keys(this.data[0]).map(key => ({
      name: key,
      sortable: this.data[0][key].sortable
    }));
  }

  sortData(column: { name: string; sortable: boolean }) {
    if (!column.sortable) return;

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

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.data.length / this.paginationConfig.rowsPerPage);
    this.paginatedData = this.data.slice(
      (this.paginationConfig.currentPage - 1) * this.paginationConfig.rowsPerPage,
      this.paginationConfig.currentPage * this.paginationConfig.rowsPerPage
    );
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.paginationConfig.currentPage = page;
    this.updatePagination();
  }

  onRowsPerPageChange() {
    this.paginationConfig.currentPage = 1;
    this.updatePagination();
  }

  // Placeholder methods for row actions
  accept(ticket: any) { console.log(`You chose to accept ticket number: ${ticket.ticketNo.value}`); }
  reject(ticket: any) { console.log(`You chose to reject ticket number: ${ticket.ticketNo.value}`); }
  edit(ticket: any) { console.log(`You chose to edit ticket number: ${ticket.ticketNo.value}`); }
  delete(ticket: any) { console.log(`You chose to delete ticket number: ${ticket.ticketNo.value}`); }

  selectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedTickets = [...this.data];
      this.data.forEach(ticket => {
        const checkbox = document.getElementById('flexCheckDefault' + ticket.ticketNo.value) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    } else {
      this.selectedTickets = [];
    }
  }

  isSelected(ticket: any): boolean {
    return this.selectedTickets.some(selectedTicket => selectedTicket.ticketNo.value === ticket.ticketNo.value);
  }

  selectTicket(event: Event, ticket: any) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedTickets.push(ticket);
    } else {
      const index = this.selectedTickets.indexOf(ticket);
      if (index !== -1) {
        this.selectedTickets.splice(index, 1);
      }
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  jumpToFirstPage() {
    this.onPageChange(1);
  }

  jumpToLastPage() {
    this.onPageChange(this.totalPages);
  }
  }
