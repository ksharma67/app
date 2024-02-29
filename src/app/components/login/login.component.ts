import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginData = {
    UserEmail: '',
    UserPassword: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    console.log('Login data:', this.loginData);
    this.apiService.login(this.loginData.UserEmail, this.loginData.UserPassword).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Extract the user ID from the response (assuming the response contains the user ID)
        const userId = response.UserID; // Adjust accordingly based on the actual response structure
        // Navigate to dashboard with user ID
        this.router.navigate(['/dashboard', userId]);
        // Store token or perform any other necessary actions
        localStorage.setItem('authToken', response.token);
      },
      error: (error) => {
        console.error('Login error', error);
        // Handle login error, e.g., display an error message to the user
      }
    });
  }
}
