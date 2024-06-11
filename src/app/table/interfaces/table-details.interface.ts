export interface TableConfig {
  data: any[];
  paginationConfig: PaginationConfig;
  columns: TableColumnDetails[];
  actionsKey?: string;
  actionsList: TableActionsDetails[];
  extraConfig?: { [key: string]: any };
}

export interface TableColumnDetails {
    name: string;
    rowDetail?:string;
    sortable?: boolean;
    draggable?: boolean;
  }

  export interface TableActionsDetails {
  actionType?:number;
  actionName: string;
  status:string | number | number[] | string[];
  actionLogic: (row: any | any[]) => void;
}

export interface PaginationConfig {
  rowsPerPage: number;
  currentPage: number;
}