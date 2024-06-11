import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableActionsDetails, TableColumnDetails, TableConfig } from '../../interfaces/table-details.interface';
import { PaginationConfig } from '../../interfaces/table-details.interface';
import { TicketDetails } from '../../interfaces/ticket-details.interface';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTableComponent implements OnChanges {
  @Input() tableConfig!:TableConfig;
  

  removedColumns: { column: TableColumnDetails, index: number }[] = [];
  selectedRowsMap: { [page: number]: any[] } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showCommonActionsOnly: boolean = false;
  paginatedData: any[] = [];
  totalPages: number = 0;
  rowsPerPageOptions: number[] = [2, 3, 4, 5];
  rowActionsMap: { [key: number]: TableActionsDetails[] } = {};

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableConfig'] && this.tableConfig.data && this.tableConfig.data.length > 0) {     
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

    this.tableConfig.data.sort((a, b) => this.compareValues(a[columnName], b[columnName], this.sortDirection));

    this.updatePagination();
  }
  compareValues(aValue: unknown, bValue: unknown, direction: 'asc' | 'desc'): number {
    if (aValue == null) return bValue == null ? 0 : 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return direction === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.tableConfig.data.length / this.tableConfig.paginationConfig.rowsPerPage);
    this.paginatedData = this.tableConfig.data.slice(
      (this.tableConfig.paginationConfig.currentPage - 1) * this.tableConfig.paginationConfig.rowsPerPage,
      this.tableConfig.paginationConfig.currentPage * this.tableConfig.paginationConfig.rowsPerPage
    );
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.tableConfig.paginationConfig.currentPage = page;
    this.updatePagination();
  }

  onRowsPerPageChange() {
    this.tableConfig.paginationConfig.currentPage = 1;
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
    const currentPage = this.tableConfig.paginationConfig.currentPage;
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
    const currentPage = this.tableConfig.paginationConfig.currentPage;
    return this.selectedRowsMap[currentPage]?.some(selected => selected.ticketNo === item.ticketNo) || false;
  }

  selectItem(event: Event, item: any) {
    const checkbox = event.target as HTMLInputElement;
    const currentPage = this.tableConfig.paginationConfig.currentPage;
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
    const columnIndex = this.tableConfig.columns.findIndex(column => column.name === columnName);

    if (columnIndex !== -1 && columnName) {
      const column = this.tableConfig.columns[columnIndex];
      this.removedColumns.push({ column, index: columnIndex });
      this.tableConfig.columns = this.tableConfig.columns.filter(col => col.name !== columnName);
    }
  }

  restoreColumn(columnName: string) {
    const removedColumn = this.removedColumns.find(column => column.column.name === columnName);
    if (removedColumn) {
      this.tableConfig.columns.splice(removedColumn.index, 0, removedColumn.column);
      this.removedColumns = this.removedColumns.filter(column => column.column.name !== columnName);
    }
  }

  restoreAllColumns() {
    this.removedColumns.forEach(removedColumn => {
      const { column, index } = removedColumn;
      if (!this.tableConfig.columns.find(col => col.name === column.name)) {
        this.tableConfig.columns.splice(index, 0, column);
      }
    });
    this.removedColumns = [];
  }

  getRowValue(row: any, columnName: string): string | number | Date | null {
    const column = this.tableConfig.columns.find(col => col.name === columnName);
    if (column) {
      return row[column.rowDetail as keyof typeof row];
    }
    return null; // Handle the case where the column is not found
  }

  setRowActions(row: any, index: number) {
    const actions = this.getRowActions(row);
    this.rowActionsMap[index] = actions;
  }

  getRowActions(row: any): TableActionsDetails[] {
    let stateId: number | string;
  
    if ((row as any).hasOwnProperty(this.tableConfig.actionsKey) && this.tableConfig.actionsKey) {
      stateId = (row as any)[this.tableConfig.actionsKey] as number;
    } else {
      console.error(`Row does not have property ${this.tableConfig.actionsKey}`);
      return [];
    }    
    return this.getActionsForState(stateId, this.tableConfig.actionsList);
  }
  
  getActionsForState(stateId: number | string, availableActions: TableActionsDetails[]): TableActionsDetails[] {
    const actions = availableActions.filter(action => {
      const statusMatch = Array.isArray(action.status)
        ? (action.status as (string | number)[]).includes(stateId)
        : action.status === stateId;
  
      const typeMatch = action.actionType === 2 || action.actionType === 3;
  
      return statusMatch && typeMatch;
    });
  
    if (actions.length === 0) {
      console.error(`No actions defined for state with ID ${stateId}`);
    }
  
    return actions;
  }
  
  performAction(actionName: string, row: any) {
    const action = this.tableConfig.actionsList.find(a => a.actionName === actionName);
    if (action && action.actionLogic) {
      action.actionLogic(row);
      this.cd.detectChanges();
    } else {
      console.error(`Action with name ${actionName} not found.`);
    }
  }

  getSelectedRowCount(): number {
    const currentPage = this.tableConfig.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    return selectedRows.length;
  }
  
  performBulkAction(actionName: string) {
    const currentPage = this.tableConfig.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    const action = this.tableConfig.actionsList.find(a => a.actionName === actionName);
  
    if (!action) {
      console.error(`Action with name ${actionName} not found.`);
      return;
    }
  
    if (action.actionLogic) {
      action.actionLogic(selectedRows);
      this.cd.detectChanges();
    } else {
      console.error(`Action with name ${actionName} has no valid logic.`);
    }
  }
}