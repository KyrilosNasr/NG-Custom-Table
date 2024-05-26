import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RowActions, TableAction, TableColumnDetails } from '../../interfaces/tableCols.interface';
import { PaginationConfig } from '../../interfaces/PaginationConfig.interface';
import { TicketDetails } from '../../interfaces/ticketDetails.interface';
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
  @Input() rowActionsList!: RowActions[];
  @Input() headerActionsList!: TableAction[];

  // To handle cases without a specific identifier key
  generatedIdKey: string = '__generatedId';

  removedColumns: { column: TableColumnDetails, index: number }[] = [];
  selectedRowsMap: { [page: number]: any[] } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showCommonActionsOnly: boolean = false;
  paginatedData: any[] = [];
  totalPages: number = 0;
  rowsPerPageOptions: number[] = [2, 3, 4, 5];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.updatePagination();
      this.cd.markForCheck();
    }
    this.updateShowCommonActionsOnly();
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
  
  selectItem(event: Event, item: any) {
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

  getRowValue(row: TicketDetails, columnName: string): any {
    const column = this.columns.find(col => col.name === columnName);
    if (column) {
      return row[column.rowDetail as keyof typeof row];
    }
    return null; // Handle the case where the column is not found
  }

  updateShowCommonActionsOnly() {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
  
    if (selectedRows.length > 1) {
      // Check if there are common actions applicable to all selected rows
      const commonActions = this.getCommonActions();
      this.showCommonActionsOnly = commonActions.length > 0;
    } else {
      this.showCommonActionsOnly = false; // Reset if less than 2 rows are selected
    }
  }
  performAction(actionId: number, item: any) {
    const action = this.rowActionsList.find(a => a.id === actionId);
    if (action && action.actionLogic) {
      action.actionLogic(item);
    } else {
      console.error(`Action with id ${actionId} not found.`);
    }
  }

  getSelectedRowCount(): number {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    return selectedRows.length;
  }
  
  getCommonActions(): { id: number, name: string, count: number }[] {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];
    if (selectedRows.length < 2) return [];
  
    const actionCounts: { [id: number]: number } = {};
    selectedRows.forEach((row) => {
      if (row.allowedActions) {
        row.allowedActions.forEach((actionId: number) => {
          if (!actionCounts[actionId]) {
            actionCounts[actionId] = 0;
          }
          actionCounts[actionId]++;
        });
      }
    });
  
    const commonActions: { id: number, name: string, count: number }[] = [];
    const processedActions: Set<number> = new Set();
  
    const allActions = [...this.headerActionsList, ...this.rowActionsList];
  
    allActions.forEach(action => {
      if (actionCounts[action.id] === selectedRows.length && !processedActions.has(action.id)) {
        commonActions.push({ id: action.id, name: action.actionName || '', count: actionCounts[action.id] || 0 });
        processedActions.add(action.id);
      }
    });
  
    return commonActions;
  }
  

  performBulkAction(actionId: number) {
    const currentPage = this.paginationConfig.currentPage;
    const selectedRows = this.selectedRowsMap[currentPage] || [];

    const action = this.headerActionsList.find(a => a.id === actionId) || this.rowActionsList.find(a => a.id === actionId);

    if (action) {
      if ('function' in action && typeof action.function === 'function') {
        action.function(selectedRows);
      } else if ('actionLogic' in action && typeof action.actionLogic === 'function') {
        action.actionLogic(selectedRows);
      } else {
        console.error(`Action with id ${actionId} has no valid logic.`);
      }
    } else {
      console.error(`Action with id ${actionId} not found.`);
    }
  }
}