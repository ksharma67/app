import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
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

  private getHttpHeaders(): HttpHeaders {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = ApiService.getToken();
    if (token) {
        headers = headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
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

  // Post a new chat message
  postChatMessage(communityId: number, userId: number, messageText: string, isAnonymous: boolean, parentMessageId?: number): Observable<any> {
    const body = {
      ChatMessageText: messageText,
      ChatMessageUserID: userId,
      CommunityID: communityId,
      IsAnonymous: isAnonymous,
      ParentMessageID: parentMessageId || null // Include the parentMessageId in the request body, defaulting to null if not provided
    };
    return this.http.post<any>(`${this.baseUrl}chatMessage/`, body, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getRepliesByMessageId(messageId: number, limit: number = 10, offset: number = 0): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}chatMessage/replies/${messageId}?limit=${limit}&offset=${offset}`, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError)
    );
  }  
  
  // Get chat messages for a specific community
  getChatMessagesByCommunity(communityId: number, limit: number = 10, offset: number = 0): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}chatMessage/community/${communityId}?limit=${limit}&offset=${offset}`, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError)
    );
  }  

  // Search chat messages within a specific community by text
  searchChatMessages(communityId: number, searchTerm: string, limit: number = 10, offset: number = 0): Observable<any[]> {
    // Encode the search term to ensure the URL is correctly formed, especially if the search term includes spaces or special characters
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    return this.http.get<any[]>(
        `${this.baseUrl}chatMessage/community/${communityId}/search?searchTerm=${encodedSearchTerm}&limit=${limit}&offset=${offset}`,
        { headers: this.getHttpHeaders() }
    ).pipe(
        catchError(this.handleError)
    );
}

  // Add a user to a community
  addUserToCommunity(communityUserCommunityID: number, communityUserUserID: number): Observable<any> {
    const body = {
      CommunityUserCommunityID: communityUserCommunityID,
      CommunityUserUserID: communityUserUserID
    };
    return this.http.post<any>(`${this.baseUrl}communityUser/`, body, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get all users in a specific community
  getUsersByCommunity(communityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}communityUser/community/${communityId}`, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to get details of the currently authenticated user
  getCurrentUserDetails(): Observable<any> {
    // Get the token from local storage
    const token = ApiService.getToken();

     // Check if token exists
    if (!token) {
      // Handle the case where token is missing
      return throwError('Token not found in local storage');
    }
    // Set the request headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Send the request with the headers
    return this.http.get<any>(`${this.baseUrl}user/me`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to signup a new user
  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/signup`, userData).pipe(
      tap(response => {
        console.log("Received token:", response.token); // Optional: for debugging
        if (response.token) {
          ApiService.saveToken(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Method to login a user
  login(email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}user/login`, { email, password })
          .pipe(
              tap(response => {
                  console.log("Received token:", response.token); // Optional: for debugging
                  ApiService.saveToken(response.token);
              }),
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
