import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableActionsDetails, TableColumnDetails } from '../../interfaces/table-details.interface';
import { PaginationConfig } from '../../interfaces/PaginationConfig.interface';
import { TicketDetails } from '../../interfaces/ticket-details.interface';
import { TableActionsService } from '../../services/table-actions.service';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges {
  @Input() data: TicketDetails[] = [];
  @Input() paginationConfig: PaginationConfig = { rowsPerPage: 5, currentPage: 1 };
  @Input() columns: TableColumnDetails[] = [];
  @Input() actionsKey!: string;
  @Input() actionsList!: TableActionsDetails[];
  

  removedColumns: { column: TableColumnDetails, index: number }[] = [];
  selectedRowsMap: { [page: number]: TicketDetails[] } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showCommonActionsOnly: boolean = false;
  paginatedData: TicketDetails[] = [];
  totalPages: number = 0;
  rowsPerPageOptions: number[] = [2, 3, 4, 5];
  rowActionsMap: { [key: number]: TableActionsDetails[] } = {};

  constructor(private cd: ChangeDetectorRef, private actionService: TableActionsService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {      
      this.updatePagination();
      this.cd.markForCheck();
    }
  }

  sortData(column: TableColumnDetails) {
    if (!column.sortable) return;
    const columnName = column.name;
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const aValue = a[columnName as keyof TicketDetails];
      const bValue = b[columnName as keyof TicketDetails];
      if (aValue && bValue) {
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.updatePagination();
  }
  // pagination

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

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  jumpToFirstPage() {
    this.onPageChange(1);
  }

  jumpToLastPage() {
    this.onPageChange(this.totalPages);
  }

  // single and multi select
  selectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentPage = this.paginationConfig.currentPage;
    if (!this.selectedRowsMap[currentPage]) {
      this.selectedRowsMap[currentPage] = [];
    }
    if (checkbox.checked) {
      this.paginatedData.forEach(item => {
        if (!this.isSelected(item)) {
          this.selectedRowsMap[currentPage].push(item);
        }
      });
    } else {
      this.selectedRowsMap[currentPage] = [];
    }
    this.cd.markForCheck();
  }

  isSelected(item: any): boolean {
    const currentPage = this.paginationConfig.currentPage;
    return this.selectedRowsMap[currentPage]?.some(selected => selected.ticketNo === item.ticketNo) || false;
  }

  selectItem(event: Event, item: TicketDetails) {
    const checkbox = event.target as HTMLInputElement;
    const currentPage = this.paginationConfig.currentPage;
    if (!this.selectedRowsMap[currentPage]) {
      this.selectedRowsMap[currentPage] = [];
    }
    if (checkbox.checked) {
      if (!this.isSelected(item)) {
        this.selectedRowsMap[currentPage].push(item);
      }
    } else {
      this.selectedRowsMap[currentPage] = this.selectedRowsMap[currentPage].filter(selected => selected.ticketNo !== item.ticketNo);
    }
    this.cd.markForCheck();
  }

  areAllVisibleSelected(): boolean {
    return this.paginatedData.length > 0 && this.paginatedData.every(row => this.isSelected(row));
  }

  areSomeVisibleSelected(): boolean {
    return this.paginatedData.some(row => this.isSelected(row)) && !this.areAllVisibleSelected();
  }

  // drag & drop

  onDragStart(event: DragEvent, column: TableColumnDetails) {
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
      const column = this.columns[columnIndex];
      this.removedColumns.push({ column, index: columnIndex });
      this.columns = this.columns.filter(col => col.name !== columnName);
    }
  }

  restoreColumn(columnName: string) {
    const removedColumn = this.removedColumns.find(column => column.column.name === columnName);
    if (removedColumn) {
      this.columns.splice(removedColumn.index, 0, removedColumn.column);
      this.removedColumns = this.removedColumns.filter(column => column.column.name !== columnName);
    }
  }

  restoreAllColumns() {
    this.removedColumns.forEach(removedColumn => {
      const { column, index } = removedColumn;
      if (!this.columns.find(col => col.name === column.name)) {
        this.columns.splice(index, 0, column);
      }
    });
    this.removedColumns = [];
  }

  getRowValue(row: TicketDetails, columnName: string): string | number | Date | null {
    const column = this.columns.find(col => col.name === columnName);
    if (column) {
      return row[column.rowDetail as keyof typeof row];
    }
    return null; // Handle the case where the column is not found
  }

  setRowActions(row: TicketDetails, index: number) {
    const actions = this.getRowActions(row);
    this.rowActionsMap[index] = actions;
  }

  getRowActions(row: TicketDetails): TableActionsDetails[] {
    let stateId: number | undefined;
  
    if ((row as any).hasOwnProperty(this.actionsKey)) {
      stateId = (row as any)[this.actionsKey] as number;
    } else {
      console.error(`Row does not have property ${this.actionsKey}`);
      return [];
    }    
    return this.actionService.getActionsForState(stateId, this.actionsList);
  }
  
  performAction(actionName: string, row: TicketDetails) {
    const action = this.actionsList.find(a => a.actionName === actionName);
    if (action && action.actionLogic) {
      action.actionLogic(row);
    } else {
      console.error(`Action with name ${actionName} not found.`);
    }
  }

  getSelectedRowCount(): number {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    return selectedRows.length;
  }
  
  performBulkAction(actionName: string) {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    const action = this.actionsList.find(a => a.actionName === actionName);
  
    if (!action) {
      console.error(`Action with name ${actionName} not found.`);
      return;
    }
  
    if (action.actionLogic) {
      action.actionLogic(selectedRows);
    } else {
      console.error(`Action with name ${actionName} has no valid logic.`);
    }
  }
}