import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('authToken')) {
      // If the token exists in local storage, allow access to the route
      return true;
    } else {
      // Otherwise, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
