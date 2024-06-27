import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, debounceTime, switchMap, tap, of, catchError, Subject, takeUntil, map, delay } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { DropdownConfig } from '../interfaces/dropdown-config.interface';
import { end } from '@popperjs/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() multiSelect = false;
  @Input() enableSearch = false;
  @Input() placeholder = '';
  @Input() pageSize = 1;
  @Input() display='';
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() dropdownBlur = new EventEmitter<void>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  isDropdownOpen = false;
  searchTerm = '';
  filteredItems: any[] = [];
  selectedItems: any[] = [];
  loading = false;
  currentPage = 1;
  totalItems = 0;

  private searchSubject = new BehaviorSubject<string>('');


  public getSelectedText(): string | undefined {
    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }

    const displayItems = this.selectedItems.map(item => item[this.display]);
    return displayItems.join(', ');
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
      this.isDropdownOpen = !this.isDropdownOpen;
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
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.searchItems(term)),
      takeUntil(this.destroy$) // Unsubscribe on destroy
    ).subscribe(items => {
      if (items.length > 0) {

        this.filteredItems = items.slice(0, this.pageSize);
        this.totalItems = items.length; // Update totalItems with the full length
      } else {
        this.filteredItems = [];
        this.totalItems = 0;
      }
    });

  }

  ngAfterViewInit() {
    this.dropdownMenu.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  private loadItems(): Observable<any[]> {
    this.loading = true;

    // Calculate start index and end index for current page
    const startIndex = this.currentPage === 1 ? this.pageSize : this.pageSize * this.currentPage
    const endIndex = startIndex + this.pageSize;
    console.log(startIndex, endIndex)
    // Check if startIndex is beyond totalItems
    if (startIndex >= this.totalItems) {
      this.loading = false;
      return of([]); // No more items to load
    }

    // Simulate loading with a direct observable
    return new Observable<any[]>(observer => {
      const newItems = this.items.slice(startIndex, endIndex);
      console.log(newItems);
      
      this.currentPage++;
      this.loading = false;

      observer.next(newItems);
      observer.complete();
    });
  }

  private searchItems(term: string): Observable<any[]> {
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
      return this.loadMoreCountries(this.currentPage, this.pageSize).pipe(
        tap(newItems => {
          this.items = [...this.items, ...newItems];
          this.currentPage++;
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
      this.loading = true;
      this.loadItems().subscribe(newItems => {
        this.filteredItems.push(...newItems);
        this.loading = false;
      });
    }
  }


  private loadMoreCountries(page: number, pageSize: number): Observable<any[]> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Simulate fetching data from backend based on startIndex and endIndex
    const slicedItems = this.filteredItems.slice(startIndex, endIndex);
    console.log(slicedItems);

    return of(slicedItems).pipe(delay(500)); // Simulating delay for demonstration
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.dropdownMenu) {
      this.dropdownMenu.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }
}