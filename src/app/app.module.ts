// Importing the required modules from Angular and our own components
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { GoogleMapsModule } from '@angular/google-maps';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CommunityComponent } from './components/community/community.component';
import { CommunityChatComponent } from './components/community-chat/community-chat.component';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { NavbarService} from './services/navbar.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  // Declaring all the components used in the module
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingComponent,
    LoginComponent,
    DashboardComponent,
    SignupComponent,
    CommunityComponent,
    CommunityChatComponent,
    FooterComponent,
    NotFoundComponent
  ],
  // Importing required modules
  imports: [
    BrowserModule, // Required module for browser rendering
    AppRoutingModule, // Required module for app routing
    FormsModule, // Required module for template-driven forms
    HttpClientModule, // Required module for HTTP requests
    MatDatepickerModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    NgxSliderModule,
    MatSnackBarModule,
    MatNativeDateModule,
    GoogleMapsModule,
    ReactiveFormsModule, // Required module for reactive forms
  ],
  // Importing the service
  providers: [ApiService, AuthService, NavbarService, provideAnimationsAsync()],
  // Bootstrapping the app component
  bootstrap: [AppComponent],
})
// Exporting the app module
export class AppModule {}
