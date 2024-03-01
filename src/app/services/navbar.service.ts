import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private loginStatus = new BehaviorSubject<boolean>(false);

  currentLoginStatus = this.loginStatus.asObservable();

  constructor() {}

  updateLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn);
  }
}
