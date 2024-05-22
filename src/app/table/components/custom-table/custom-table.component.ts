import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TicketCols } from '../../interfaces/ticketCols.interface';
import { PaginationConfig } from '../../interfaces/PaginationConfig.interface';
import { Ticket } from '../../interfaces/ticketDetails.interface';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges {
  @Input() data: Ticket[] = [];
  @Input() paginationConfig: PaginationConfig = { rowsPerPage: 5, currentPage: 1 };
  @Input() columns: TicketCols[] = [];

  removedColumns: { name: string, index: number }[] = [];
  selectedTicketsMap: { [page: number]: Ticket[] } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  paginatedData: Ticket[] = [];
  totalPages: number = 0;
  rowsPerPageOptions: number[] = [2, 3, 4, 5];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.updatePagination();
      this.cd.markForCheck();
    }
  }

  generateColumns() {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]).map(key => ({
        name: key,
        sortable: true // Assuming all columns are sortable; will be adjusted later while working on sorting fix
      }));
    }
  }

  sortData(column: TicketCols) {
    if (!column.sortable) return;

    const columnName = column.name;
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const aValue = a[columnName as keyof Ticket];
      const bValue = b[columnName as keyof Ticket];

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

  getTicketValue(ticket: Ticket, columnName: string): any {
    return ticket[columnName as keyof Ticket];
  }

  onRowsPerPageChange() {
    this.paginationConfig.currentPage = 1;
    this.updatePagination();
  }

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
    const checkbox = event.target as HTMLInputElement;
    const currentPage = this.paginationConfig.currentPage;
    if (!this.selectedTicketsMap[currentPage]) {
      this.selectedTicketsMap[currentPage] = [];
    }
    if (checkbox.checked) {
      this.paginatedData.forEach(ticket => {
        if (!this.isSelected(ticket)) {
          this.selectedTicketsMap[currentPage].push(ticket);
        }
      });
    } else {
      this.selectedTicketsMap[currentPage] = [];
    }
  }

  isSelected(ticket: Ticket): boolean {
    const currentPage = this.paginationConfig.currentPage;
    return this.selectedTicketsMap[currentPage] && this.selectedTicketsMap[currentPage].some(selected => selected.ticketNo === ticket.ticketNo);
  }

  selectTicket(event: Event, ticket: Ticket) {
    const checkbox = event.target as HTMLInputElement;
    const currentPage = this.paginationConfig.currentPage;
    if (!this.selectedTicketsMap[currentPage]) {
      this.selectedTicketsMap[currentPage] = [];
    }
    if (checkbox.checked) {
      if (!this.isSelected(ticket)) {
        this.selectedTicketsMap[currentPage].push(ticket);
      }
    } else {
      this.selectedTicketsMap[currentPage] = this.selectedTicketsMap[currentPage].filter(selected => selected.ticketNo !== ticket.ticketNo);
    }
  }

  areAllVisibleSelected(): boolean {
    const currentPage = this.paginationConfig.currentPage;
    return this.paginatedData.length > 0 && this.paginatedData.every(ticket => this.isSelected(ticket));
  }

  areSomeVisibleSelected(): boolean {
    const currentPage = this.paginationConfig.currentPage;
    return this.paginatedData.some(ticket => this.isSelected(ticket)) && !this.areAllVisibleSelected();
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

  onDragStart(event: DragEvent, column: any) {
    event.dataTransfer?.setData('text/plain', column.name);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const columnName = event.dataTransfer?.getData('text/plain');
    const columnIndex = this.columns.findIndex(column => column.name === columnName);

    if (columnIndex !== -1 && columnName) {
      this.removedColumns.push({ name: columnName, index: columnIndex });
    }
    this.columns = this.columns.filter(column => column.name !== columnName);
  }

  restoreColumn(columnName: string) {
    const removedColumn = this.removedColumns.find(column => column.name === columnName);
    if (removedColumn) {
      this.columns.splice(removedColumn.index, 0, { name: columnName, sortable: true });
      this.removedColumns = this.removedColumns.filter(column => column.name !== columnName);
    }
  }

  restoreAllColumns() {
    this.removedColumns.forEach(removedColumn => {
      const { name, index } = removedColumn;
      if (!this.columns.find(column => column.name === name)) {
        this.columns.splice(index, 0, { name, sortable: true });
      }
    });
    this.removedColumns = [];
  }
}