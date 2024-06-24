import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { COUNTRIES } from 'src/assets/data/countries-list';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  constructor() { }

  getCountries(page: number, pageSize: number): Observable<Country[]> {
    // Simulating pagination for demonstration
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const countriesPage = COUNTRIES.slice(startIndex, endIndex);
    return of(countriesPage).pipe(delay(1000)); // Simulating delay for demonstration
  }
}
