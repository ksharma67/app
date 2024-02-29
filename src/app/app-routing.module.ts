import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommunityComponent } from './components/community/community.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// Define the routes for the application
const routes: Routes = [
  {
    path: '',
    component: LandingComponent  // Display LandingComponent at the root path
  },
  {
    path: 'home',
    redirectTo: '/',
    pathMatch: 'full'  // Redirect from '/home' to the root path
  },
  {
    path: 'signup',
    component: SignupComponent  // Display SignupComponent at the '/signup' path
  },
  {
    path: 'login',
    component: LoginComponent  // Display LoginComponent at the '/login' path
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent  // Display DashboardComponent at the '/dashboard' path
  },
  {
    path: 'community',
    component: CommunityComponent  // Display GroupsComponent at the '/groups' path
  },
  {
    path: 'footer',
    component: FooterComponent // Footer component to display
  },
  {
    path: 'navbar',
    component: NavbarComponent // Navbar component to display
  },
  {
    path: '**',
    component: NotFoundComponent // You need to create this component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }), HttpClientModule],  // Import the router module and HTTP client module
  exports: [RouterModule, HttpClientModule],  // Export the router module and HTTP client module
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})

// Define the AppRoutingModule class
export class AppRoutingModule { }
