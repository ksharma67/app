import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl; // Use environment variable for base URL
  private static tokenKey = 'auth_token'; // Static token key for local storage
  constructor(private http: HttpClient) {}

  // Generic GET request method with error handling
  private get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  loadServerLog(): Observable<any> {
    const mockLogData = {
      logEntry1: 'Sample log entry 1',
      logEntry2: 'Sample log entry 2',
      // Add more mock log entries if needed
    };
    
    return new Observable<any>((observer) => {
      setTimeout(() => {
        observer.next(mockLogData);
        observer.complete();
      }, 1000);
    });
  }

  // Fetch all communities
  getAllCommunities(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}community`).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch a single community by ID
  getCommunityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}community/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new community
  createCommunity(communityData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}community`, communityData).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a community by ID
  deleteCommunity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}community/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to GET all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}user`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to GET a single user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to get user details by ID
  getUserDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user/${id}/details`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to signup a new user
  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/signup`, userData)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  // Method to login a user
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/login`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to save JWT in local storage
  static saveToken(token: string): void {
    localStorage.setItem(ApiService.tokenKey, token); // Access token key statically
  }

  // Method to retrieve JWT from local storage
  static getToken(): string | null {
    return localStorage.getItem(ApiService.tokenKey); // Access token key statically
  }

  // Method to check if user is logged in (JWT exists)
  static isLoggedIn(): boolean {
    return !!ApiService.getToken(); // Access token key statically
  }

  // Method to log out user by removing JWT from local storage
  static logout(): void {
    localStorage.removeItem(ApiService.tokenKey); // Access token key statically
  }

  // Method to POST a new user
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to UPDATE a user
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}user/${id}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to DELETE a user
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}user/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error(`An error occurred: ${error.message || 'Unknown error'}`));
  }
}
