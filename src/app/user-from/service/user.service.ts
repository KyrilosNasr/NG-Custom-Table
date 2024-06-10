import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  private users: User[] = [];

  addUser(user: User) {
    const users = this.usersSubject.getValue(); // Get current users array
    this.users.push(user);
    const currentUsers = this.usersSubject.getValue();
    const updatedUsers = [...currentUsers, user];
    this.usersSubject.next(updatedUsers);
  }

  isEmailUnique(email: string):{emailNotUnique: boolean;} | null {
    return this.users.some(user => user.email === email) ? {'emailNotUnique':true} : null;
  }
  
  isPhoneNumberUnique(phoneNumber: number): ValidationErrors | null {
    return this.users.some(user => user.phoneNumber === phoneNumber) ? {'phoneNotUnique':true} : null;
  }
  isNationalIdUnique(nationalId: number): ValidationErrors | null {
    return this.users.some(user => user.nationalId === nationalId) ? {'nationalIdNotUnique':true} : null;
  }
}
