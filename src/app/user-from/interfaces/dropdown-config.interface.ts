import { Observable } from "rxjs";
import { Country } from "./country.interface";

export interface DropdownConfig {
  items: Country[];
  multiSelect?: boolean;
  enableSearch?: boolean;
  placeholder?: string;
  pageSize?: number;
  loadMoreData: (page: number, pageSize: number) => Observable<Country[]>;
}