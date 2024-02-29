import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }
  
  public isMenuCollapsed = true;
  public isLoggedIn = false; // Assuming you have a variable to track login status
  
  ngOnInit(): void {
    // Check if the user is logged in when the component initializes
    this.isLoggedIn = ApiService.isLoggedIn();
  }
  
  toggleNavbar() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  
  logout() {
    // Implement logout functionality here
    // For example, clear localStorage, reset login status, navigate to logout page, etc.
    // After logout, update isLoggedIn variable
    ApiService.logout();
    this.isLoggedIn = false;
    // Redirect to home page or login page after logout
    this.router.navigate(['/login']);
  }
}