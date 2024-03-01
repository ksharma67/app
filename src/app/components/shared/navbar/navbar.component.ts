import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NavbarService } from '../../../services/navbar.service'; // Update the path as needed

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isMenuCollapsed = true;
  public isLoggedIn = false; // This will be updated based on the observable
  
  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // Subscribe to changes in login status
    this.navbarService.currentLoginStatus.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Initial check for login status
    this.isLoggedIn = ApiService.isLoggedIn();
  }

  toggleNavbar() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout() {
    ApiService.logout(); // Correct way to call a static method
    this.navbarService.updateLoginStatus(false); // Update navbar login status
    this.router.navigate(['/login']); // Navigate to login page
  }  
}