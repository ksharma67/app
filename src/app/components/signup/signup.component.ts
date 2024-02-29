import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      UserEmail: ['', [Validators.required, Validators.email]],
      UserPassword: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      UserName: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    console.log('Initial signup form value:', this.signupForm.value);
  }

  onSignup(): void {
    console.log('Submitting signup form...');
    
    if (this.signupForm.invalid) {
      console.log('Form is invalid, cannot proceed with signup.');
      console.log('Invalid form value:', this.signupForm.value);
      return;
    }
  
    const formData = { ...this.signupForm.value };
    delete formData.ConfirmPassword;
  
    this.apiService.signup(formData).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
        this.router.navigate(['/dashboard', response?.UserID]);
      },
      error: (error) => {
        console.error('Signup error', error);
        // Safely check if the error structure is as expected
        const userEmailControl = this.signupForm.get('UserEmail');
        if (userEmailControl !== null) {
          userEmailControl.setErrors({ emailAlreadyInUse: true });
        }
        // Log or handle other types of errors appropriately
      }
    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('UserPassword')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('ConfirmPassword')?.setErrors({ passwordsNotMatch: true });
    } else {
      formGroup.get('ConfirmPassword')?.setErrors(null);
    }
  }

  logInput(fieldName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    console.log(fieldName + ':', inputElement.value);
  }
}
