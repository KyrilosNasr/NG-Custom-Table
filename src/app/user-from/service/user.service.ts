import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$: Observable<any[]> = this.usersSubject.asObservable();

  private users: any[] = [];

  addUser(user: any) {
    this.users.push(user);
    this.usersSubject.next(this.users);
  }

  isEmailUnique(email: string): boolean {
    return !this.users.some(user => user.email === email);
  }

  isPhoneNumberUnique(phoneNumber: string): boolean {
    return !this.users.some(user => user.phoneNumber === phoneNumber);
  }

  isNationalIdUnique(nationalId: string): boolean {
    return !this.users.some(user => user.nationalId === nationalId);
  }
}
