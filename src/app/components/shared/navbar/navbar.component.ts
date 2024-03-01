import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NavbarService } from '../../../services/navbar.service'; // Update the path as needed

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {

  public isMenuCollapsed = true;
  public isLoggedIn = false; // This will be updated based on the observable
  public isDashboardRoute = false; // Variable to track if the current route is the Dashboard
  
  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Subscribe to changes in login status
    this.navbarService.currentLoginStatus.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Initial check for login status
    this.isLoggedIn = ApiService.isLoggedIn();

    // Check if the current route is the Dashboard route
    this.updateDashboardRoute(this.router.url);

    // Subscribe to route changes to update the Dashboard route status
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigated to:', event.url);
      }
    });
  }

  private updateDashboardRoute(url: string): void {
    this.isDashboardRoute = url.endsWith('/dashboard');
  }  

  toggleNavbar() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    console.log('Navbar toggled:', this.isMenuCollapsed);
    this.changeDetectorRef.detectChanges(); // Manually trigger change detection
  }

  logout() {
    ApiService.logout(); // Correct way to call a static method
    this.navbarService.updateLoginStatus(false); // Update navbar login status
    this.router.navigate(['/login']); // Navigate to login page
  }  
}