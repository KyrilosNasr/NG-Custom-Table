import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, debounceTime, switchMap, tap, of, catchError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { DropdownConfig } from '../interfaces/dropdown-config.interface';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit, AfterViewInit, OnDestroy {
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


  public getSelectedText(): string | undefined {
    return this.selectedItems.length
      ? this.selectedItems.map(item => `${item.name} (${item.phoneCode})`).join(', ')
      : this.placeholder;
  }

  public onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  public reset(event: Event) {
    event.stopPropagation();
    this.selectedItems = [];
    this.searchTerm = '';
    this.onSearch();
  }

  public toggleSelection(item: Country) {
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

  public isSelected(item: Country): boolean {
    return this.selectedItems.indexOf(item) >= 0;
  }

  public toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.onSearch();
    }
    this.dropdownBlur.emit();
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

  private loadInitialItems() {
    this.loadItems().subscribe(items => {
      this.items = items;
      this.filteredItems = this.items;
    });
  }

  private loadItems(): Observable<Country[]> {
    this.loading = true;
    return this.loadMoreData(this.page, this.pageSize).pipe(
      tap(() => {
        this.page++;
        this.loading = false;
      })
    );
  }

  private searchItems(term: string): Observable<Country[]> {
    if (!term.trim()) {
      return of(this.items);
    }

    const lowerCaseTerm = term.toLowerCase();
    const matchingItems = this.items.filter(item =>
      item.name.toLowerCase().includes(lowerCaseTerm) ||
      item.phoneCode.includes(lowerCaseTerm)
    );

    if (matchingItems.length > 0) {
      return of(matchingItems);
    } else {
      // Load more data only if no matching items found in the current list
      return this.loadMoreData(this.page, this.pageSize).pipe(
        tap(newItems => {
          this.items = [...this.items, ...newItems];
          this.page++;
        }),
        switchMap(() => {
          const updatedMatchingItems = this.items.filter(item =>
            item.name.toLowerCase().includes(lowerCaseTerm) ||
            item.phoneCode.includes(lowerCaseTerm)
          );
          return of(updatedMatchingItems);
        }),
        catchError(() => of([]))
      );
    }
  }


  private onScroll() {
    const dropdownMenu = this.dropdownMenu.nativeElement;
    const bottomOfMenu = dropdownMenu.scrollHeight - dropdownMenu.scrollTop <= dropdownMenu.clientHeight;
    if (this.isDropdownOpen && !this.loading && bottomOfMenu) {
      this.loadItems().subscribe(newItems => {
        this.items = [...this.items, ...newItems];
        this.filteredItems = this.items;
      });
    }
  }
}