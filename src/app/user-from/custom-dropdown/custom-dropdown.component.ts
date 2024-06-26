import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, debounceTime, switchMap, tap, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { DropdownConfig } from '../interfaces/dropdown-config.interface';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit, AfterViewInit {
  @Input() items: Country[] = [];
  @Input() multiSelect = false;
  @Input() enableSearch = false;
  @Input() placeholder = '';
  @Input() pageSize = 1;
  @Input() loadMoreData!: (page: number, pageSize: number) => Observable<Country[]>;

  @Output() selectionChange = new EventEmitter<Country[]>();
  @Output() dropdownBlur = new EventEmitter<void>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  isDropdownOpen = false;
  searchTerm = '';
  filteredItems: Country[] = [];
  selectedItems: Country[] = [];
  loading = false;
  page = 1;

  private searchSubject = new BehaviorSubject<string>('');

  public reset() {
    this.selectedItems = [];
  }

  ngOnInit() {
    this.loadInitialItems();
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.searchItems(term))
    ).subscribe(items => this.filteredItems = items);
  }

  ngAfterViewInit() {
    this.dropdownMenu.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy() {
    if (this.dropdownMenu) {
      this.dropdownMenu.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.onSearch();
    }
    this.dropdownBlur.emit();
  }

  toggleSelection(item: Country) {
    if (this.multiSelect) {
      const index = this.selectedItems.indexOf(item);
      if (index >= 0) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = [item];
      this.isDropdownOpen = false;
    }
    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: Country): boolean {
    return this.selectedItems.indexOf(item) >= 0;
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  loadInitialItems() {
    this.loadItems().subscribe(items => {
      this.items = items;
      this.filteredItems = this.items;
    });
  }

  loadItems(): Observable<Country[]> {
    this.loading = true;
    return this.loadMoreData(this.page, this.pageSize).pipe(
      tap(() => {
        this.page++;
        this.loading = false;
      })
    );
  }

  searchItems(term: string): Observable<Country[]> {
    if (!term.trim()) {
      return of(this.items);
    }
    return of(this.items.filter(item => item.name.toLowerCase().includes(term.toLowerCase())));
  }

  onScroll() {
    const dropdownMenu = this.dropdownMenu.nativeElement;
    const bottomOfMenu = dropdownMenu.scrollHeight - dropdownMenu.scrollTop <= dropdownMenu.clientHeight;
    if (this.isDropdownOpen && !this.loading && bottomOfMenu) {
      this.loadItems().subscribe(newItems => {
        this.items = [...this.items, ...newItems];
        this.filteredItems = this.items;
      });
    }
  }

  getSelectedText(): string | undefined {
    return this.selectedItems.length 
      ? this.selectedItems.map(item => `${item.name} (${item.phoneCode})`).join(', ') 
      : this.placeholder;
  }

  setSelectedItems(items: Country[]): void {
    this.selectedItems = items;
    this.selectionChange.emit(this.selectedItems);
  }
}
