import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // This method should be replaced with your actual logic to retrieve the current user's ID
  getCurrentUserId(): number | null {
    // Example: Retrieve and return the user ID from local storage or a JWT token
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
