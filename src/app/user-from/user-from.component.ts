import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './service/user.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-from',
  templateUrl: './user-from.component.html',
  styleUrls: ['./user-from.component.scss']
})
export class UserFromComponent implements OnInit {
  userForm!: FormGroup;
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  genders = ['Male', 'Female'];
  countryCodes = [{ code: '+20', country: 'EG' }, { code: '+966', country: 'SA' }];
  dob!: string | null;
  model!: NgbDateStruct;
  date!: { year: number; month: number };

  constructor(private fb: FormBuilder, private userService: UserService, private datePipe: DatePipe) {}

  public validateField(field: string) {
    const control = this.userForm.get(field);
    if (control) {
      console.log(control.value);
      
      control.markAsTouched();
    }
  }

  public resetForm() {
    this.userForm.reset();
  }

  public onSubmit() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value);
      
      this.resetForm();
      }
    this.convertDateToString('dateOfBirth'); // Convert the date before submitting the form
    console.log(this.userForm.value);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstNameEn: ['', Validators.required],
      secondNameEn: ['', Validators.required],
      thirdNameEn: ['', Validators.required],
      lastNameEn: ['', Validators.required],
      firstNameAr: ['', Validators.required],
      secondNameAr: ['', Validators.required],
      thirdNameAr: ['', Validators.required],
      lastNameAr: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        this.emailUniqueValidator.bind(this)
      ]],
      countryCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.phoneNumberUniqueValidator.bind(this)]],
      dateOfBirth: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.nationalIdUniqueValidator.bind(this)]],
      maritalStatus: ['', Validators.required],
      gender: ['', Validators.required],
      addressEn: ['', Validators.required],
      addressAr: ['', Validators.required]
    });
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

  private convertDateToString(controlName: string) {
    const control = this.userForm.get(controlName);
    if (control) {
      const dateValue: NgbDateStruct = control.value;
      if (this.isValidNgbDateStruct(dateValue)) {
        const jsDate = new Date(dateValue.year, dateValue.month - 1, dateValue.day); // Create a JavaScript Date object
  
        if (!isNaN(jsDate.getTime())) { // Check if the date is valid
          const formattedDate = this.formatDate(jsDate);
          // control.setValue(formattedDate);
        } else {
          console.error('Invalid date format');
        }
      } else {
        console.error('Invalid NgbDateStruct format');
      }
    }
  }
  
  private isValidNgbDateStruct(date: any): date is NgbDateStruct {
    return date && typeof date.year === 'number' && typeof date.month === 'number' && typeof date.day === 'number';
  }
  
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(  2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
}
