import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Save data to local storage
  save(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Retrieve data from local storage
  get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Clear data from local storage
  clear(key: string): void {
    localStorage.removeItem(key);
  }
}
