import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { COUNTRIES } from 'src/assets/data/countries-list';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  constructor() { }

  getCountries(): Observable<Country[]> {   
    return of(COUNTRIES).pipe(delay(1000)); // Simulating delay for demonstration
  }
}
