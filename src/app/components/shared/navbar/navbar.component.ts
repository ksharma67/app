import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }
  
  public isMenuCollapsed = true;
  public isLoggedIn = false; // Assuming you have a variable to track login status
  
  ngOnInit(): void {
    // Check if the user is logged in when the component initializes
    this.isLoggedIn = this.checkLoginStatus();
  }
  
  toggleNavbar() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  
  checkLoginStatus(): boolean {
    // Implement logic to check if the user is logged in
    // For example, you can check if there's a token in localStorage or a session variable
    // Return true if logged in, false otherwise
    return false; // Replace with your actual logic
  }
  
  logout() {
    // Implement logout functionality here
    // For example, clear localStorage, reset login status, navigate to logout page, etc.
    // After logout, update isLoggedIn variable
    this.isLoggedIn = false;
  }
}
