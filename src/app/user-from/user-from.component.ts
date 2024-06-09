import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './service/user.service';
import { DatePipe, formatDate } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';

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
  submited = false;
  constructor(private fb: FormBuilder, private userService: UserService, private datePipe: DatePipe) {

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
      dob: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.nationalIdUniqueValidator.bind(this)]],
      maritalStatus: ['', Validators.required],
      gender: ['', Validators.required],
      addressEn: ['', Validators.required],
      addressAr: ['', Validators.required]
    });

    if (this.userForm.get('dob')?.value) {  // Check if dob has a value
      this.dob = this.datePipe.transform(this.userForm.get('dob')?.value, 'D, MMMM, YYYY');
    }
  }

  validateField(field: string) {
    const control = this.userForm.get(field);
    if (control) {
      control.markAsTouched();
    }
  }
  emailUniqueValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.userService.isEmailUnique(control.value)) {
      return null;
    }
    return { 'emailNotUnique': true };
  }

  phoneNumberUniqueValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.userService.isPhoneNumberUnique(control.value)) {
      return null;
    }
    return { 'phoneNumberNotUnique': true };
  }

  nationalIdUniqueValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.userService.isNationalIdUnique(control.value)) {
      return null;
    }
    return { 'nationalIdNotUnique': true };
  }

  onSubmit() {
    this.submited = true
    console.log('Form Submitted!', this.userForm.value);
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value);
      console.log('Form Submitted!', this.userForm.value);
      this.userForm.reset();
    }
  }
}
