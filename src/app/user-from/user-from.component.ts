import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './service/user.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { Country } from './interfaces/country.interface';
import { Observable } from 'rxjs';
import { DropdownConfig } from './interfaces/dropdown-config.interface';
import { CountriesService } from './service/countries.service';

@Component({
  selector: 'app-user-from',
  templateUrl: './user-from.component.html',
  styleUrls: ['./user-from.component.scss']
})
export class UserFromComponent implements OnInit {
  userForm!: FormGroup;
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  genders = ['Male', 'Female'];
  countryCodes:Country[] = [];
  dob!: string | null;
  model!: NgbDateStruct;
  date!: { year: number; month: number };

  page = 1;
  pageSize = 10;

  constructor(private fb: FormBuilder, private userService: UserService, private countriesServ: CountriesService) { }


  public resetForm() {
    this.userForm.reset();
  }

  public onSubmit() {
    if (this.userForm.valid) {
      const formValue = { ...this.userForm.value };
      const dateOfBirthControl = this.userForm.get('dateOfBirth');
      if (dateOfBirthControl) {
        formValue.dateOfBirth = this.formatDateObject(dateOfBirthControl.value);
      }
      this.userService.addUser(formValue);
      // Reset the form
      this.resetForm();
    }
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstNameEn: ['', Validators.required],
      secondNameEn: ['', Validators.required],
      thirdNameEn: ['', Validators.required],
      lastNameEn: ['', Validators.required],
      firstNameAr: ['', [Validators.required , this.CheckArLletters.bind(this)]],
      secondNameAr: ['', [Validators.required , this.CheckArLletters.bind(this)]],
      thirdNameAr: ['', [Validators.required , this.CheckArLletters.bind(this)]],
      lastNameAr: ['', [Validators.required , this.CheckArLletters.bind(this)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        this.emailUniqueValidator.bind(this)
      ]],
      countryCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.phoneNumberUniqueValidator.bind(this),Validators.maxLength(11),Validators.minLength(10)]],
      dateOfBirth: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.nationalIdUniqueValidator.bind(this)]],
      maritalStatus: ['', Validators.required],
      gender: ['', Validators.required],
      addressEn: ['', Validators.required],
      addressAr: ['', Validators.required]
    });

    this.loadInitialCountries();
  }
  private CheckArLletters(control:FormControl){
    return this.userService.arabicValidator(control.value)
  }
  private emailUniqueValidator(control: FormControl) {
    return this.userService.isEmailUnique(control.value)
  }

  private phoneNumberUniqueValidator(control: FormControl) {
    return this.userService.isPhoneNumberUnique(control.value)
  }

  private nationalIdUniqueValidator(control: FormControl) {
    return this.userService.isNationalIdUnique(control.value)
  }
  private formatDateObject(dateObj: { year: number, month: number, day: number }): string {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day); // -1 -> bcs months is 0 based indexs
    return formatDate(date, 'dd MMMM yyyy', 'en-US');
  }

  loadInitialCountries() {
    this.loadMoreCountries(this.page, this.pageSize).subscribe(countries => this.countryCodes = countries);
  }
  
  loadMoreCountries = (page: number, pageSize: number): Observable<Country[]> => {
    // Simulate an API call
    return this.countriesServ.getCountries(page,pageSize)
  };

  onSelectionChange(selectedCountries: Country[]) {
    console.log('Selected countries:', selectedCountries);
    // Handle selected countries logic here
  }
}
